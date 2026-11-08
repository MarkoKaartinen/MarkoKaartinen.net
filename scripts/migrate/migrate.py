#!/usr/bin/env python3
"""
Vanhan blogin (Laravel + markdown/WP-HTML) sisällön siirto Hugon page bundleiksi.

- Lukee vanhaa repoa (--old) vain luku -tilassa, tuotannon dumppia ja uploads-kansiota (--import).
- Kirjoittaa content/{vuosi}/{slug}/index.md ja kuvat samaan kansioon (--out).
- Legacy-HTML muunnetaan markdowniksi (pandoc), WP-roskat siivotaan, kuvat slugataan.

Käyttö:
  python3 scripts/migrate/migrate.py --old <vanha-repo> [--import import] [--out import/out]
         [--only slug1,slug2] [--limit N]
"""
import argparse
import html
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import unicodedata
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

# ---------------------------------------------------------------- apuja


def fold_decode(name):
    """Purkaa #UXXXX-koodatut merkit ja normalisoi NFC:ksi."""
    name = re.sub(r'#U([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), name)
    return unicodedata.normalize('NFC', name)


def slugify(text):
    s = fold_decode(text)
    for a, b in (('ä', 'a'), ('Ä', 'A'), ('ö', 'o'), ('Ö', 'O'), ('å', 'a'), ('Å', 'A')):
        s = s.replace(a, b)
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return s


def slug_filename(name):
    base, ext = os.path.splitext(name)
    ext = ext.lower().lstrip('.')
    if ext == 'jpeg':
        ext = 'jpg'
    slug = slugify(base) or 'kuva'
    return slug + ('.' + ext if ext else '')


def unquote_yaml(v):
    v = v.strip()
    if len(v) >= 2 and v[0] == "'" and v[-1] == "'":
        return v[1:-1].replace("''", "'")
    if len(v) >= 2 and v[0] == '"' and v[-1] == '"':
        try:
            return json.loads(v)
        except Exception:
            return v[1:-1]
    return v


def parse_front(text):
    m = re.match(r'^---\n(.*?)\n---\n?(.*)$', text, re.S)
    if not m:
        return {}, text
    lines = m.group(1).split('\n')
    body = m.group(2)
    data = {}
    i = 0
    while i < len(lines):
        km = re.match(r'^([A-Za-z_]\w*):\s*(.*)$', lines[i])
        if not km:
            i += 1
            continue
        key, val = km.groups()
        if val in ('|', '>', '|-', '>-'):
            i += 1
            block = []
            while i < len(lines) and (lines[i].startswith(' ') or lines[i] == ''):
                block.append(lines[i].strip())
                i += 1
            data[key] = ' '.join(b for b in block if b).strip()
            continue
        if val == '':
            i += 1
            items = []
            while i < len(lines) and re.match(r'^\s*-\s+', lines[i]):
                items.append(unquote_yaml(re.sub(r'^\s*-\s+', '', lines[i])))
                i += 1
            data[key] = items
            continue
        data[key] = unquote_yaml(val)
        i += 1
    return data, body


def yq(s):
    return json.dumps(s, ensure_ascii=False)


def iso(dt):
    """'2009-08-09 13:45' -> '2009-08-09T13:45:00'"""
    dt = str(dt).strip().replace(' ', 'T')
    if re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$', dt):
        dt += ':00'
    return dt


# ---------------------------------------------------------------- uploads

class Uploads:
    def __init__(self, root):
        self.root = root
        self.index = {}   # normalisoitu suhteellinen polku -> todellinen polku
        self.lower = {}
        self.by_dir = {}  # hakemisto -> [tiedostonimet]
        for dirpath, _, files in os.walk(root):
            for f in files:
                if f.startswith('.'):
                    continue
                full = os.path.join(dirpath, f)
                rel = os.path.relpath(full, root)
                key = fold_decode(rel)
                self.index[key] = full
                self.lower[key.lower()] = full
                self.by_dir.setdefault(fold_decode(os.path.dirname(rel)), []).append(fold_decode(f))

    def find(self, rel):
        if not rel:
            return None
        rel = unicodedata.normalize('NFC', unquote(rel))
        for cand in (rel, rel.replace('+', ' '), unquote(rel.replace('+', '%20'))):
            cand = unicodedata.normalize('NFC', cand)
            if cand in self.index:
                return self.index[cand]
            if cand.lower() in self.lower:
                return self.lower[cand.lower()]
        return None

    def largest_variant(self, rel):
        """Etsii saman kuvan suurimman WP-version (stem-LxK.ext), jos alkuperäistä ei ole."""
        rel = unicodedata.normalize('NFC', unquote(rel))
        d, name = os.path.split(rel)
        stem, ext = os.path.splitext(name)
        best, best_px = None, -1
        for f in self.by_dir.get(d, []):
            fs, fe = os.path.splitext(f)
            if fe.lower() != ext.lower() or not fs.lower().startswith(stem.lower()):
                continue
            m = re.search(r'-(\d+)x(\d+)$', fs[len(stem):] or '')
            px = int(m.group(1)) * int(m.group(2)) if m else 0
            if px > best_px:
                best, best_px = f, px
        return self.find(os.path.join(d, best)) if best else None

    def pick(self, href_rel, src_rel):
        """Valitsee kuvasta parhaan (suurimman) saatavilla olevan version."""
        for cand in (href_rel,):
            p = self.find(cand)
            if p:
                return p
        for rel in (src_rel,):
            if not rel:
                continue
            stripped = re.sub(r'-\d+x\d+(\.[A-Za-z0-9]+)$', r'\1', rel)
            for c in (stripped, rel):
                p = self.find(c)
                if p:
                    return p
            p = self.largest_variant(stripped)
            if p:
                return p
        return None


def upload_rel(url):
    m = re.search(r'/uploads/(.+)$', urlsplit(url).path)
    return m.group(1) if m else None


# ---------------------------------------------------------------- HTML-puu

VOID = {'br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'param', 'embed', 'wbr', 'area', 'base', 'col', 'track'}
AUTOCLOSE = {'p': {'p'}, 'li': {'li'}, 'tr': {'tr', 'td', 'th'}, 'td': {'td', 'th'}, 'th': {'td', 'th'}}


class Node:
    def __init__(self, tag, attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or {})
        self.children = []
        self.parent = None

    def add(self, child):
        if isinstance(child, Node):
            child.parent = self
        self.children.append(child)

    def classes(self):
        return set((self.attrs.get('class') or '').split())

    def text(self):
        out = []
        for c in self.children:
            out.append(c if isinstance(c, str) else c.text())
        return ''.join(out)

    def walk(self):
        for c in list(self.children):
            if isinstance(c, Node):
                yield c
                yield from c.walk()


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        closers = AUTOCLOSE.get(tag)
        if closers and self.stack[-1].tag in closers:
            self.stack.pop()
        node = Node(tag, [(k.lower(), v or '') for k, v in attrs])
        self.stack[-1].add(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        tag = tag.lower()
        node = Node(tag, [(k.lower(), v or '') for k, v in attrs])
        self.stack[-1].add(node)

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].add(data)


def esc_attr(v):
    return html.escape(v, quote=True)


def serialize(node):
    out = []
    for c in node.children:
        if isinstance(c, str):
            out.append(html.escape(c, quote=False))
        else:
            if c.tag in VOID:
                attrs = ''.join(' %s="%s"' % (k, esc_attr(v)) for k, v in c.attrs.items() if k in ('href', 'src', 'alt', 'title'))
                out.append('<%s%s>' % (c.tag, attrs))
            else:
                attrs = ''.join(' %s="%s"' % (k, esc_attr(v)) for k, v in c.attrs.items() if k in ('href', 'src', 'alt', 'title', 'colspan', 'rowspan'))
                out.append('<%s%s>%s</%s>' % (c.tag, attrs, serialize(c), c.tag))
    return ''.join(out)


def replace_node(node, new_children):
    parent = node.parent
    idx = parent.children.index(node)
    parent.children[idx:idx + 1] = []
    for offset, ch in enumerate(new_children):
        parent.children.insert(idx + offset, ch)
        if isinstance(ch, Node):
            ch.parent = parent


def unwrap(node):
    replace_node(node, list(node.children))


def remove(node):
    node.parent.children.remove(node)


# ---------------------------------------------------------------- muunnin

YT_RE = re.compile(r'(?:youtube(?:-nocookie)?\.com/(?:embed|v)/|youtu\.be/)([A-Za-z0-9_-]{11})')
VIMEO_RE = re.compile(r'player\.vimeo\.com/video/(\d+)')


# Vanhat taksonomia-osoitteet, jotka eroavat uuden sivuston slugeista
CATEGORY_SLUGS = {'tapaaminen-net': 'tapaaminennet'}
DEAD_SERIES = {'iphone-6-suojat'}


class Article:
    def __init__(self, year, slug, fm, body, legacy):
        self.year = year
        self.slug = slug
        self.fm = fm
        self.body = body
        self.legacy = legacy
        self.tokens = {}
        self.next_token = 0
        self.copies = {}      # lähdepolku -> kohdetiedoston nimi (bundlessa)
        self.used_names = set()
        self.warnings = []

    def warn(self, msg):
        self.warnings.append(msg)

    def token(self, kind, **data):
        self.next_token += 1
        key = '@@%s:%d@@' % (kind, self.next_token)
        data['kind'] = kind
        self.tokens[key] = data
        return key

    def dest_name(self, src_path):
        if src_path in self.copies:
            return self.copies[src_path]
        name = slug_filename(os.path.basename(src_path))
        base, ext = os.path.splitext(name)
        n = 2
        while name in self.used_names:
            name = '%s-%d%s' % (base, n, ext)
            n += 1
        self.used_names.add(name)
        self.copies[src_path] = name
        return name


class Converter:
    def __init__(self, uploads, slug_year, tag_slugs):
        self.uploads = uploads
        self.slug_year = slug_year
        self.tag_slugs = tag_slugs

    # -- linkit
    def rewrite_link(self, art, href):
        href = href.strip()
        m = re.match(r'^(?:https?:)?//(?:www\.)?markokaartinen\.net(/[^#?]*)?([#?].*)?$', href)
        if m:
            path, rest = m.group(1) or '/', m.group(2) or ''
        elif href.startswith('/') and not href.startswith('//'):
            path, rest = urlsplit(href).path, ('#' + urlsplit(href).fragment if urlsplit(href).fragment else '')
        else:
            return href
        if '/uploads/' in path:
            return href
        if path.startswith('/s/photos/'):
            return 'https://unsplash.com' + path + (rest if rest.startswith('?') else '')
        parts = [p for p in path.split('/') if p]
        if not parts:
            return '/' + rest
        # /{vuosi}/{kk}/{pv}/{slug}
        if len(parts) == 4 and re.match(r'^\d{4}$', parts[0]) and parts[3] in self.slug_year:
            return '/%s/%s%s' % (self.slug_year[parts[3]], parts[3], rest)
        # /{vuosi}/{slug}
        if len(parts) == 2 and re.match(r'^\d{4}$', parts[0]):
            return '/%s/%s%s' % (parts[0], parts[1], rest)
        # /{slug}/
        if len(parts) == 1 and parts[0] in self.slug_year:
            return '/%s/%s%s' % (self.slug_year[parts[0]], parts[0], rest)
        if len(parts) == 2 and parts[0] in ('kategoria', 'category'):
            return '/kategoria/%s%s' % (CATEGORY_SLUGS.get(parts[1], parts[1]), rest)
        if len(parts) == 2 and parts[0] in ('tag', 'avainsana'):
            return '/avainsana/%s%s' % (parts[1], rest)
        if len(parts) == 2 and parts[0] in ('sarja', 'sarjat'):
            if parts[1] in DEAD_SERIES:
                return ''  # sarjaa ei enää ole: linkki puretaan tekstiksi
            return '/sarja/%s%s' % (parts[1], rest)
        if len(parts) == 1 and parts[0] in ('blogi', 'tietoa', 'nyt', 'linkit', 'haku', 'vieraskirja', 'reseptit',
                                            'kategoriat', 'avainsanat', 'sarjat', 'ai', 'pelihaaste', 'kahvilaskuri'):
            return '/%s%s' % (parts[0], rest)
        art.warn('Sisäinen linkki ei tunnistettu: %s' % href)
        return href

    # -- kuvat
    def image_token(self, art, img, link_href=None, caption=None):
        src = img.attrs.get('src', '')
        alt = img.attrs.get('alt', '').strip()
        # ladataan "data-src", jos lazy-lataus
        if not src and img.attrs.get('data-src'):
            src = img.attrs['data-src']
        rel_src = upload_rel(src)
        rel_href = upload_rel(link_href) if link_href else None
        if rel_src or rel_href:
            path = self.uploads.pick(rel_href if rel_href and re.search(r'\.(jpe?g|png|gif|webp)$', rel_href, re.I) else None, rel_src or rel_href)
            if path:
                return art.token('IMG', dest=art.dest_name(path), src_path=path, alt=alt, title=caption or '')
            art.warn('Kuvaa ei löydy uploads-kansiosta: %s' % (rel_href or rel_src))
            return art.token('IMG', dest=src, src_path=None, alt=alt, title=caption or '')
        if src:
            return art.token('IMG', dest=src, src_path=None, alt=alt, title=caption or '')
        return ''

    def is_image_link(self, href):
        return bool(href) and bool(re.search(r'\.(jpe?g|png|gif|webp)(\?.*)?$', urlsplit(href).path, re.I))

    def caption_of(self, node):
        for n in node.walk():
            if n.tag == 'figcaption' or 'wp-caption-text' in n.classes() or 'blocks-gallery-item__caption' in n.classes():
                t = re.sub(r'\s+', ' ', n.text()).strip()
                if t:
                    return t
        return ''

    def process_images(self, art, root):
        # galleriat
        for node in list(root.walk()):
            if node.parent is None:
                continue
            cl = node.classes()
            if 'wp-block-gallery' in cl or 'gallery' in cl:
                toks = []
                for item in node.walk():
                    if item.tag == 'img':
                        a = item.parent if item.parent.tag == 'a' else None
                        href = a.attrs.get('href') if a is not None else None
                        cap = ''
                        container = item.parent
                        while container is not None and container is not node and container.tag not in ('li', 'figure'):
                            container = container.parent
                        if container is not None and container is not node:
                            cap = self.caption_of(container)
                        t = self.image_token(art, item, href if self.is_image_link(href) else None, cap)
                        if t:
                            toks.append(t)
                if toks:
                    key = art.token('GAL', images=toks)
                    p = Node('p')
                    p.add(key)
                    replace_node(node, [p])
                else:
                    remove(node)
        # figure / wp-caption
        for node in list(root.walk()):
            if node.parent is None:
                continue
            if node.tag == 'figure' or 'wp-caption' in node.classes():
                imgs = [n for n in node.walk() if n.tag == 'img']
                if len(imgs) == 1:
                    img = imgs[0]
                    a = img.parent if img.parent.tag == 'a' else None
                    href = a.attrs.get('href') if a is not None else None
                    t = self.image_token(art, img, href if self.is_image_link(href) else None, self.caption_of(node))
                    p = Node('p')
                    p.add(t)
                    replace_node(node, [p])
        # loput kuvat
        for img in [n for n in root.walk() if n.tag == 'img']:
            if img.parent is None:
                continue
            parent = img.parent
            a = parent if parent.tag == 'a' else None
            href = a.attrs.get('href') if a is not None else None
            if a is not None and self.is_image_link(href) and len([c for c in a.children if isinstance(c, Node) or c.strip()]) == 1:
                t = self.image_token(art, img, href)
                replace_node(a, [t] if t else [])
            else:
                t = self.image_token(art, img)
                replace_node(img, [t] if t else [])

    # -- upotukset
    def embed_for(self, art, node):
        srcs = [node.attrs.get('src', ''), node.attrs.get('data', '')]
        for n in node.walk():
            srcs += [n.attrs.get('src', ''), n.attrs.get('value', '')]
        for s in srcs:
            m = YT_RE.search(s)
            if m:
                start = re.search(r'[?&]start=(\d+)', s)
                return '{{< youtube id="%s"%s >}}' % (m.group(1), (' start="%s"' % start.group(1)) if start else '')
            m = VIMEO_RE.search(s)
            if m:
                return '{{< vimeo id="%s" >}}' % m.group(1)
        src = node.attrs.get('src', '')
        if node.tag == 'iframe' and src.startswith(('http', '//')):
            if src.startswith('//'):
                src = 'https:' + src
            title = node.attrs.get('title', '')
            return '<iframe src="%s"%s width="%s" height="%s" loading="lazy" allowfullscreen></iframe>' % (
                esc_attr(src), (' title="%s"' % esc_attr(title)) if title else '',
                esc_attr(node.attrs.get('width', '560')), esc_attr(node.attrs.get('height', '315')))
        return None

    def process_embeds(self, art, root):
        for node in list(root.walk()):
            if node.parent is None:
                continue
            if node.tag in ('iframe', 'object'):
                out = self.embed_for(art, node)
                if out:
                    key = art.token('HTML', html=out)
                    p = Node('p')
                    p.add(key)
                    replace_node(node, [p])
                else:
                    art.warn('Upotus pudotettu: <%s> %s' % (node.tag, node.attrs.get('src', '')[:80]))
                    remove(node)
            elif node.tag == 'embed':
                if node.parent is not None and node.parent.tag != 'object':
                    out = self.embed_for(art, node)
                    if out:
                        p = Node('p')
                        p.add(art.token('HTML', html=out))
                        replace_node(node, [p])
                    else:
                        remove(node)

    # -- siivous
    def clean(self, art, root):
        for node in list(root.walk()):
            if node.parent is None:
                continue
            if node.tag in ('script', 'style', 'noscript', 'link', 'meta', 'svg', 'form', 'button', 'input', 'param', 'colgroup', 'col'):
                if node.tag == 'svg':
                    art.warn('SVG pudotettu')
                remove(node)
            elif node.tag == 'i' and 'fa' in node.classes():
                remove(node)
            elif node.tag in ('div', 'span', 'font', 'center', 'section', 'article', 'header', 'footer', 'u', 'figure'):
                unwrap(node)
            elif node.tag == 'a':
                href = node.attrs.get('href', '')
                new = self.rewrite_link(art, href) if href else ''
                if new:
                    node.attrs['href'] = new
                else:
                    unwrap(node)
            elif node.tag == 'h1':
                node.tag = 'h2'

    def convert_html(self, art, body):
        builder = Builder()
        builder.feed(body)
        builder.close()
        root = builder.root
        self.process_embeds(art, root)
        self.process_images(art, root)
        self.clean(art, root)
        cleaned = serialize(root)
        proc = subprocess.run(
            ['pandoc', '-f', 'html', '-t', 'gfm', '--wrap=none'],
            input=cleaned, text=True, capture_output=True)
        if proc.returncode != 0:
            art.warn('pandoc-virhe: %s' % proc.stderr.strip()[:200])
            return ''
        return self.finish(art, proc.stdout)

    # -- tokenit takaisin
    def render_image(self, art, key):
        t = art.tokens[key]
        alt = t['alt'].replace('[', '(').replace(']', ')')
        title = (' "%s"' % t['title'].replace('"', '\\"')) if t['title'] else ''
        return '![%s](%s%s)' % (alt, t['dest'], title)

    def finish(self, art, md):
        md = re.sub(r'^(@@IMG:\d+@@)[ \t]*(?=\S)', r'\1\n\n', md, flags=re.M)

        def gal(m):
            t = art.tokens[m.group(0)]
            return '{{< galleria >}}\n' + '\n'.join(self.render_image(art, k) for k in t['images']) + '\n{{< /galleria >}}'
        md = re.sub(r'@@GAL:\d+@@', gal, md)
        md = re.sub(r'@@IMG:\d+@@', lambda m: self.render_image(art, m.group(0)), md)
        md = re.sub(r'^@@HTML:\d+@@[ \t]*$', lambda m: art.tokens[m.group(0).strip()]['html'], md, flags=re.M)
        md = re.sub(r'@@HTML:\d+@@', lambda m: art.tokens[m.group(0)]['html'], md)
        md = md.replace('&nbsp;', ' ').replace(' ', ' ')
        md = re.sub(r'\n{3,}', '\n\n', md).strip() + '\n'
        return md

    # -- markdown-artikkelit (uudet)
    def convert_markdown(self, art, body, media_root):
        text = body
        # kramdown-attribuutti {: class="lead"} -> Goldmarkin {.lead} (kappaleen perään)
        lines = text.split('\n')
        out = []
        i = 0
        while i < len(lines):
            m = re.match(r'^\{:\s*([^}]*)\}\s*$', lines[i])
            if m and i + 1 < len(lines):
                cls = re.findall(r'class="([^"]+)"', m.group(1))
                i += 1
                while i < len(lines) and lines[i].strip():
                    out.append(lines[i])
                    i += 1
                if cls:
                    out.append('{.%s}' % cls[0].replace(' ', '.'))
                continue
            out.append(lines[i])
            i += 1
        text = '\n'.join(out)

        def img(m):
            alt, url, title = m.group(1), m.group(2).strip(), m.group(3)
            mm = re.match(r'^/media/(\d{4})/([^?]+)', url)
            if mm:
                src = os.path.join(media_root, mm.group(1), unquote(mm.group(2)))
                if os.path.exists(src):
                    name = art.dest_name(src)
                    return '![%s](%s%s)' % (alt, name, (' "%s"' % title) if title else '')
                art.warn('Mediakuvaa ei löydy: %s' % url)
            return m.group(0)
        text = re.sub(r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)', img, text)
        # galleria: kappale, jossa on vain 2+ kuvaa
        blocks = re.split(r'\n\s*\n', text)
        for idx, block in enumerate(blocks):
            lines_ = [l for l in block.split('\n') if l.strip()]
            if lines_ and all(re.fullmatch(r'\s*(!\[[^\]]*\]\([^)]*\)\s*)+', l) for l in lines_):
                imgs = re.findall(r'!\[[^\]]*\]\([^)]*\)', block)
                if len(imgs) >= 2:
                    blocks[idx] = '{{< galleria >}}\n' + '\n'.join(imgs) + '\n{{< /galleria >}}'
        text = '\n\n'.join(blocks)
        # sisäiset linkit
        text = re.sub(r'\]\(((?:https?://(?:www\.)?markokaartinen\.net)?/[^)\s]*)\)',
                      lambda m: '](%s)' % self.rewrite_link(art, m.group(1)), text)
        return re.sub(r'\n{3,}', '\n\n', text).strip() + '\n'


# ---------------------------------------------------------------- pääohjelma

def clean_description(d):
    d = re.sub(r'\s+', ' ', d or '').strip()
    d = re.sub(r'\s*(\[…\]|…|\.\.\.)?\s*Jatka lukemista.*$', '', d, flags=re.I).strip()
    return d


def frontmatter(art, mastodon_id, aliases):
    fm = art.fm
    lines = ['---', 'title: %s' % yq(fm.get('title', art.slug))]
    date = iso(fm.get('published_at', ''))
    lines.append('date: %s' % date)
    upd = iso(fm.get('updated_at', '')) if fm.get('updated_at') else ''
    if upd and upd != date:
        lines.append('lastmod: %s' % upd)
    desc = clean_description(fm.get('description', ''))
    if desc:
        lines.append('description: %s' % yq(desc))
    if fm.get('status') and fm['status'] != 'published':
        lines.append('draft: true')
    for key in ('categories', 'tags', 'series'):
        vals = fm.get(key)
        if vals:
            lines.append('%s: [%s]' % (key, ', '.join(yq(v) for v in vals)))
    if aliases:
        lines.append('aliases: [%s]' % ', '.join(yq(a) for a in aliases))
    if mastodon_id:
        lines.append('mastodon_post_id: %s' % yq(str(mastodon_id)))
    lines.append('---')
    return '\n'.join(lines) + '\n\n'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--old', required=True, help='vanhan repon juuri (vain luku)')
    ap.add_argument('--import', dest='imp', default='import')
    ap.add_argument('--out', default='import/out')
    ap.add_argument('--only', default='')
    ap.add_argument('--limit', type=int, default=0)
    args = ap.parse_args()

    articles_dir = os.path.join(args.old, 'storage/content/articles')
    media_root = os.path.join(args.old, 'storage/media')
    db = sqlite3.connect(os.path.join(args.imp, 'database.sqlite'))
    mastodon = {(r[0], r[1]): r[2] for r in db.execute('select year, slug, mastodon_post_id from articles where mastodon_post_id is not null')}
    aliases = {}
    for old, new in db.execute('select old, new from redirects'):
        m = re.match(r'^https?://[^/]+/(\d{4})/([^/?#]+)', new)
        if m:
            aliases.setdefault((int(m.group(1)), m.group(2)), []).append('/%s/' % old)

    sources = []
    slug_year = {}
    for y in sorted(os.listdir(articles_dir)):
        p = os.path.join(articles_dir, y)
        if not os.path.isdir(p) or not y.isdigit():
            continue
        for f in sorted(os.listdir(p)):
            if f.endswith('.md'):
                text = open(os.path.join(p, f), encoding='utf-8').read()
                fm, body = parse_front(text)
                slug = f[:-3]
                sources.append((int(y), slug, fm, body))
                slug_year[slug] = int(y)

    only = set(s for s in args.only.split(',') if s)
    if only:
        sources = [s for s in sources if s[1] in only]
    if args.limit:
        sources = sources[:args.limit]

    uploads = Uploads(os.path.join(args.imp, 'uploads'))
    conv = Converter(uploads, slug_year, None)
    out_root = os.path.join(args.out, 'content')
    if os.path.isdir(out_root):
        shutil.rmtree(out_root)
    report = []
    stats = {'legacy': 0, 'markdown': 0, 'images': 0, 'warnings': 0}

    for year, slug, fm, body in sources:
        legacy = str(fm.get('legacy', '')).lower() == 'true'
        art = Article(year, slug, fm, body, legacy)
        if legacy:
            md = conv.convert_html(art, body)
            stats['legacy'] += 1
        else:
            md = conv.convert_markdown(art, body, media_root)
            stats['markdown'] += 1
        bundle = os.path.join(out_root, str(year), slug)
        os.makedirs(bundle, exist_ok=True)
        for src, name in art.copies.items():
            shutil.copy2(src, os.path.join(bundle, name))
            stats['images'] += 1
        with open(os.path.join(bundle, 'index.md'), 'w', encoding='utf-8') as fh:
            fh.write(frontmatter(art, mastodon.get((year, slug)), aliases.get((year, slug))))
            fh.write(md)
        if art.warnings:
            stats['warnings'] += len(art.warnings)
            report.append('## %d/%s\n' % (year, slug) + '\n'.join('- ' + w for w in art.warnings) + '\n')

    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, 'report.md'), 'w', encoding='utf-8') as fh:
        fh.write('# Migraatioraportti\n\n%s\n\n' % json.dumps(stats))
        fh.write('\n'.join(report))
    print(json.dumps(stats))


if __name__ == '__main__':
    main()
