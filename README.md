# Chainseer — static website

A dependency-free marketing site for Chainseer, a Solana memecoin assistant that filters out almost all rugs and sends only vetted new coins to Telegram.
Four pages, one stylesheet, one progressive-enhancement script. No build step,
no external fonts, no analytics, no cookies.

## Preview

```bash
cd site
python3 -m http.server 8080
```

Open <http://localhost:8080>. The site also works when opened directly from
disk (`file://`), though a local server is closer to production.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Landing page: hero, live sample alert, screening pipeline, features, Telegram CTA, outcome loop, FAQ, risk banner |
| `styles.css` | Design tokens, layout, components, legal-page styles, responsive and print rules |
| `script.js` | Mobile nav, sticky header, scroll reveal, counters, active nav, copy-to-clipboard, smooth anchors, config |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `risk.html` | Risk Disclosure |
| `robots.txt` | Crawler policy + sitemap pointer |
| `sitemap.xml` | Sitemap for the four pages |

## Before launch

1. **Telegram link.** Replace `https://t.me/chainseer` in `script.js`
   (`CONFIG.telegramUrl`) and in every `href` that carries `data-telegram`.
   The script overrides the HTML at runtime, but editing both keeps no-JS
   visitors working. For a private group use the invite link
   (`https://t.me/+...`).
2. **Domain.** Replace `https://chainseer.example` in the canonical tag, Open
   Graph tags, `robots.txt`, and `sitemap.xml`. Update `lastmod` when you do.
3. **Legal placeholders.** Replace `[Operator name]`, `contact@chainseer.example`,
   `[governing jurisdiction]`, `[venue]`, and `[postal address, if required in
   your jurisdiction]`. Have a qualified lawyer review the three legal pages
   for your jurisdiction. They are a solid starting point, not legal advice.
4. **Dates.** Update “Last updated” / “Effective” if you change the legal text.
5. **Social preview.** Add an `og.png` (1200×630) and point `og:image` /
   `twitter:image` at it. The current markup intentionally omits an image
   rather than shipping a broken reference.
7. **Recheck the numbers.** The thresholds and weights on the page mirror
   the bot's config and scorer defaults at the time of writing.
   If you change `.env` defaults in the bot, update the copy.

## Notes

- The alert card in the hero and the phone mockup are **illustrative sample
  data**, labelled as such. They are not real alerts or performance claims.
- `script.js` centralises the Telegram URL in `CONFIG`. Keep it and the HTML
  `href`s in sync.
- All motion is disabled under `prefers-reduced-motion`.
- Legal pages hide the table of contents below 680px and are print-friendly.
- The MIT licence applies to the Chainseer software, not to the site copy or
  brand; the terms page states this distinction.
