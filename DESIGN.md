# Chainseer — redesign concept & system

## Brief
Chainseer is a read-only Solana memecoin screening assistant. It watches every new launch, runs
contract / holder / deployer / market checks, scores survivors 0 to 100, and posts them to a
Telegram group. It never trades, never touches a wallet. Audience: Solana traders who are tired
of rug-pull gambling. The job of the site: get them into the Telegram group while convincing
them this is the opposite of a casino. Tone: trust, calm, instrument-grade honesty.

Constraints: keep the four pages (index, terms, privacy, risk), keep the no-tracking privacy
stance and the legal copy, add a designed 404.

## Concept (chosen, from three territories)

| | A. The sieve (process) | B. The event log (material) | C. The radar (metaphor) |
|---|---|---|---|
| Idea | The whole site is the filter: you watch launches get rejected, and almost nothing gets through | The site is one continuous on-chain event log, sections are log lines | A watchtower sweeps; pings only for survivors |
| Signature | A live stream of launches stamped REJECT with reasons; one survivor falls through the gate into a Telegram card | Timed log lines; the score is the only bright number | Radar sweep with blips |
| Emotion | calm order, confidence through restraint | cold precision | tension, gamey |
| Anchor | "built to reject more than it sends" (their real copy) | the 15s scan cycle | hype adjacency |
| O/F/Fe/P | 4 / 5 / 4 / 2 | 3 / 4 / 4 / 2 | 3 / 2 / 3 / 4 |

**Picked A.** It is the only one whose emotion is *rejection as order*, which is exactly the
trust/calm brief. The B log idea gets stolen for details (timestamps, meta lines), never structure.

**Idea:** Almost nothing gets through. Every design decision expresses the ratio: the page is a
screening report; you watch rejection happen; the one survivor is celebrated quietly.

**Metaphor:** an inspection lab report: paper, hairline gates, rubber stamps, mono data.

**Signature moment:** the Sieve. A stream of launch rows falls toward a hairline gate; each row
is stamped with its reject reason (bundler, mint authority, sniper, wash volume, dev history) and
dims; one row clears the gate and settles into a Telegram alert card. Driven by one clock; pauses
off screen; static stamped fallback under reduced motion / no JS.

**Emotion:** the first 3 seconds feel like reading a calm instrument, not watching an ad.

**Motion verb:** "clear" — things settle through a hairline gate; rejects are struck, dimmed and
stamped. Same ease family everywhere (expo.out for entrances, expo.inOut for gates).

**Screenshot frame:** the Sieve mid-rejection: three struck, stamped rejects, the gate line, and
one green row passing through into the alert card, with the big ratio line above.

## Art direction

**Archetype:** Tech precise, but *light*. Every crypto site is dark; a paper-white inspection
report is the trust signal and the differentiator. One dark panel only: the Telegram delivery
section is "inside the machine", a motivated chapter change.

**Palette (roles):**
- `--c-bg: #F4F5F2` cool paper (ground)
- `--c-ink: #131712` ink
- `--c-muted: #565B54` secondary text (AA on ground at body sizes)
- `--c-line: rgba(19,23,18,0.16)` hairlines (the gates)
- `--c-pass: #0E7B4F` signal green, used only for things that pass (accent)
- `--c-reject: #B3402A` used only for rejection states inside the sieve and stamps
- `--c-curtain: #131712`
- Dark chapter: `#101410` ground, `#E9ECE7` ink, same green pass.

**Type:** Switzer (Fontshare, 400/500/650) for display and text; Fragment Mono (Google, 400) for
data, stamps, meta, timestamps. Display is sentence case, tracked -0.04em at display sizes,
leading 0.9. Body 16 to 18px, 1.55 leading, 62ch measure. Numbers tabular.

**Scale:** --t-mega clamp(3.4rem, 1.1rem + 9.2vw, 9.6rem); --t-xl clamp(2.2rem, 1.4rem + 3.4vw, 4.6rem);
--t-l clamp(1.55rem, 1.25rem + 1.5vw, 2.5rem); --t-m clamp(1.2rem, 1.1rem + 0.5vw, 1.45rem);
--t-body clamp(1rem, 0.95rem + 0.2vw, 1.125rem); --t-s .875rem; --t-xs .75rem.

**Grid:** 12 columns, gutter clamp(1rem, 0.6rem + 1.6vw, 2.5rem), wrap 1280px. Text blocks hang
from col lines 1, 5, 9. Four-corner frame header: wordmark left, nav right, meta line in the
footer corners. Section rhythm: tight 8u / normal 16u / airy 26u, assigned per section, never
constant.

**Shape:** one radius rule, 2px (stamped plates). No pills.

**Micro-interactions (one per role):**
- Primary CTA: ink floods the plate from the pointer side; label inverts to paper. Same treatment everywhere a CTA appears.
- Nav links: underline draw (no line at rest, current page keeps it).
- Check rows (index list): the gate hairline draws across, and the reject reason slides in on hover.
- Inline links: underline at rest, rises into a highlight band.
- Arrows: nudge along direction.
- Utility/legal links: color change only.

**Idle state:** the hero scan plate ticks a 15-to-0 countdown on the one clock; the Sieve keeps a
slow march of rows while on screen. Both pause off screen and under reduced motion.

**Continuity:** no loader (instant calm arrival is the trust move; the page earns it by being
14 KB). Page transitions: a paper panel with an ink gate line sweeps down over the old page while
the next fetches, then lifts. Reduced motion: short fade.

**Genericness test:** the generic answer for this prompt is dark + purple gradient glow + three
equal feature cards (exactly the old site). The paper inspection report, rejection-as-structure
and stamps are not in that distribution; the reject reasons (bundler, mint authority, sniper) are
subject-specific. Passes.

## Composition plan (home, one family per section)

```
1 POSTER     hero: display statement + lede + 4-plate stat strip, corner meta
2 STICKY NARRATIVE  the Sieve: stream of launches, gate, survivor card (signature)
3 INDEX LIST  the six checks: full-width rows, reject reasons, hairline gates
4 STATEMENT  "A hundred coins hit the gate. One reaches your phone." manifesto voice, t-l
5 DATA       the filter keeps score: checkpoints 15m/1h/6h/24h, tabular numerals
6 DARK CHAPTER  Telegram delivery: device panel, alert card, CTA (motivated dark)
7 INDEX ROWS  FAQ as disclosure rows
8 FOOTER FINALE  "Get the shortlist." + legal corner
```

Legal pages: same paper system, sticky TOC, stamped callouts, section numbers as mono gate marks.
404: "Reject reason: no such address." stamped REJECT plate, link back.
