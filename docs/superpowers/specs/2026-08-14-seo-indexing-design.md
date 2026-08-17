# SEO / Google indexing setup — Dele Parfum

## Problem

`deleparfum.com.ar` is live and responding (200 OK on both apex and `www`), but has
zero pages indexed by Google (`site:deleparfum.com.ar` returns no results). The site
was never registered in Google Search Console, has no `robots.txt` or sitemap, and is
missing several on-page SEO signals (canonical, `og:image`, structured data).

## Goal

Get the site verified in Google Search Console and crawlable/indexable, and add the
on-page SEO groundwork needed to support future ranking (structured data, sitemap,
meta tags) — bundled into a single deploy since updates to Hostinger are manual.

## Out of scope

- Per-product pages (long-tail SEO) — current site is a single page (`index.astro`)
- Rewriting `<title>`/`<meta description>` copy for target keywords
- Google Business Profile / local pack
- Backlink building
- A dedicated 1200×630 OG banner image (using existing square `logo.png` for now)

## Design

### 1. Search Console verification (HTML tag method)

Santiago adds the property `https://deleparfum.com.ar` in Google Search Console
(URL-prefix type), selects the "HTML tag" verification method, and hands off the
`content` value Google generates. That value gets added as:

```html
<meta name="google-site-verification" content="{{VALUE_FROM_GOOGLE}}" />
```

in the `<head>` of `src/pages/index.astro`. DNS TXT was considered and rejected —
HTML tag is simpler and doesn't require touching Hostinger's DNS panel.

### 2. Sitemap — `@astrojs/sitemap`

Add the official Astro integration (`npm install @astrojs/sitemap`) and register it
in `astro.config.mjs`. It uses the already-configured `site: 'https://deleparfum.com.ar'`
to emit `sitemap-index.xml` at build time. Today it will contain a single URL; it
scales automatically if product pages are added later. No manual XML maintenance.

### 3. `robots.txt`

New static file at `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://deleparfum.com.ar/sitemap-index.xml
```

### 4. On-page meta tags

Add to `<head>` in `index.astro`:

- `<link rel="canonical" href="https://deleparfum.com.ar/" />`
- `<meta property="og:url" content="https://deleparfum.com.ar/" />`
- `<meta property="og:image" content="https://deleparfum.com.ar/assets/logo.png" />`
- `<meta name="twitter:card" content="summary_large_image" />`
- `<meta name="twitter:title" content="Dele Parfum — Fragancias de autor" />`
- `<meta name="twitter:description" content="Decants de perfumes de lujo. En tu medida." />`
- `<meta name="twitter:image" content="https://deleparfum.com.ar/assets/logo.png" />`

Existing `title` and `meta description` are left unchanged (out of scope).

### 5. Structured data (JSON-LD)

Two `<script type="application/ld+json">` blocks in `index.astro`:

**a) Store-level `OnlineStore` schema** (static object, no address — site is 100%
online, no physical storefront):

```json
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Dele Parfum",
  "url": "https://deleparfum.com.ar",
  "logo": "https://deleparfum.com.ar/assets/logo.png",
  "sameAs": ["https://instagram.com/deleparfum"],
  "areaServed": "AR"
}
```

**b) Per-product `Product` schema**, generated in a loop from the existing `products`
frontmatter array (no new data source — reuses `name`, `slug`, `descriptor`, `p10`,
image path):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{p.name}}",
  "image": "https://deleparfum.com.ar/assets/products/{{p.slug}}.{{p.ext || 'jpg'}}",
  "description": "{{p.descriptor}}",
  "offers": {
    "@type": "Offer",
    "price": "{{p.p10}}",
    "priceCurrency": "ARS",
    "availability": "https://schema.org/InStock"
  }
}
```

`p10` (10ml price) is used as the canonical offer price — single price point per
product, no `AggregateOffer` needed since it'd add complexity for marginal benefit.

### 6. Deploy flow

Same branch → PR → merge flow used for the earlier catalog change. After merge,
Santiago runs `npm run build` and manually uploads `dist/` to Hostinger — only then
is the verification tag live and Search Console verification + sitemap submission
can happen.

## Open dependency

The actual `google-site-verification` content value isn't known yet — it only exists
once Santiago creates the property in Search Console. Everything else in this design
can be implemented without it; that one line gets filled in once he has the value.
