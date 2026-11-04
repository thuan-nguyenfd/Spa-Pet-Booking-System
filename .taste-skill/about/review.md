# MEOMEO About — design and validation

Scope: static React `/about`, desktop only per the latest user request. No backend, API, database, authentication, new dependency or shared Header/Footer changes.

## Direction

Photographs at uneven sizes; seed 195460693. Brand type retained (Nunito Sans), accent #FED519, white ground and neutral panels.

Inventory: MEOMEO's repeated name, Vietnamese voice, pet grooming, Cho Quan, door number 273, An Duong Vuong, yellow accent, booking by pet/weight, four verified service types, service durations, the four already licensed photographs.

Argument: a welcoming grooming destination → illustrated photo-led hero; family-like care → edited story and quotation; explore the brand → five functional chapters; booking and grooming expectations → four ordered moments matching existing frontend flows; values → editorial list; find the actual address → map and working directions; choose a service or appointment → real routes.

Idea: On this page, MEOMEO's repeated, familiar-sounding name becomes a family photo album with five browsable chapters, ending at its own door number, 273. The live thing is the chapter switcher and its expandable photo gallery.

Redraws: dark hero replaced by Three prints, one line because the brief fixes a predominantly white brand page. Staff portrait scroll replaced by Wide photo, colour tile, facts because no verified team portraits exist. The overall direction's large top headline takes precedence over the hero slot's small headline; the pale field maps to the established white ground. No pinned scene: no actual team material to justify it. Shared Header/Footer retained as requested. Numbered tabs explicitly requested by the user take precedence over Taste's no-numbering preference.

## Implementation

- `frontend/src/pages/public/AboutPage.jsx`: hero, story, chapters, experience, values, location, CTA; page title and one-time section reveals.
- `frontend/src/components/about/aboutData.js`: static address, image metadata, tab labels, services, values, care and experience copy.
- `frontend/src/components/about/AboutElements.jsx`: shared image rendering and responsive lazy map with independent external directions link.
- `frontend/src/components/about/AboutTabs.jsx`: five tab layouts, ARIA relationships, roving tab focus, Arrow/Home/End keys, moving indicator, native modal image gallery with Escape and focus return.
- `frontend/src/styles/about.css`: About-scoped styles, brand font loading, flat surfaces, photo motion, hover/press/focus states and reduced-motion fallback. Responsive rules written before the desktop-only clarification remain, but further mobile/tablet work was stopped.

## Verification

- Vite production build successful: 139 modules. Output: `frontend/node_modules/.cache/about-build`.
- No lint script in package.json. Final Taste source lint: 0 FAIL, 1 WARN (user-requested numbered tabs). The earlier run also warned about the required brand font; Nunito Sans was intentionally retained.
- Production inspector: 0 FAIL with explicit allowances for numbering and contrast. Numbering is user-required. Contrast allowance covers an existing Footer measurement that incorrectly reads white text against white rather than its visible dark ancestor background; no Footer modification was made. About's foreground/background pairs remain high contrast.
- Inspector warnings: multiple font sizes (includes the shared chrome and responsive display sizes), no video (no verified venue/process footage; subtle movement on an existing photo instead), margin mismatch (shared Header's pre-existing insets; About sections use equal 5vw insets), horizontal tab scrolling below desktop widths (retained from the earlier scope).
- Browser checks at desktop widths 1280, 1366, 1440, 1600, 1920: all 25 tab cases passed. No page overflow, broken image, heading over two lines, or JS exception. Zero Fetch/XHR requests while browsing About. Google Maps and fonts load external resources as permitted; they do not depend on Spring Boot.
- ArrowLeft/ArrowRight/Home/End, gallery opening, Escape closing and focus restoration passed at all five desktop widths. Reduced motion checked at 1366.
- Production screenshots and browser reports are in `frontend/node_modules/.cache/about-production` and `about-browser-check.json`. Every desktop overview and all five desktop chapter screenshots were opened and reviewed. The first gallery screenshot follows an immediate scroll and can catch the heading partway through its 700ms entrance; it settles normally.
- CTA hrefs use existing ROUTES.BOOKING, ROUTES.SERVICES and ROUTES.SERVICE_DETAIL(id). The current ServiceDetailPage is itself an existing placeholder; the About page does not implement or change it.

## Visual critique

ROUND 1
Seen in one second: three uneven dog photographs, but the largest crop hides the face.
Idea (one sentence): MEOMEO as a small family photo album, ending at 273.
Live thing: five chapters and a photo viewer.
Layout words by section: hero=unequal prints / story=photo with essay / chapters=interactive spread / experience=staggered ordered row / values=type list / location=map / cta=yellow field.
Scores: design 7 · usability 8 · creativity 6.5 · content 7 → overall 7.2 before caps.
Caps applied: first-screen focal-point FAIL capped the first round to 6.0.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-fold.jpg: main photo hides the dog's face → moved Sage to the hero.
2. desktop-fold.jpg: quiet headline has insufficient hierarchy → moved it above the prints at display scale.
3. desktop-page-01.jpg: neutral ground has a slight warm tint → changed to neutral #F3F3F3.

ROUND 2
Seen in one second: “Một nhà. Nhiều yêu thương.” followed by the dog's face.
Idea (one sentence): MEOMEO's familiar name becomes a browsable family album, closed by the actual address 273.
Live thing: five keyboard-accessible chapters and an expandable photo gallery.
Layout words by section: hero=unequal prints / story=photo with essay / chapters=interactive spread / experience=staggered ordered row / values=type list / location=map / cta=yellow field.
Scores: design 7.5 · usability 8.5 · creativity 7 · content 7.5 → overall 7.7 before caps.
Caps applied: user-required numbering remains an explicit exception to Taste's house style; under the strict no-numbering rubric, score is capped at 6.5. The usable result is preferred to violating the explicit brief.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-page-01.jpg / chapter screenshots: existing Shih Tzu photograph has soft detail and a visible original date imprint. Retained as licensed source material; replace with verified brand photography when available.
2. chapter screenshots: images are a dog-only stock set, rather than actual MEOMEO/cat imagery. Keep honest illustration labeling and existing source credits; owner can supply authorized cat/venue photos.
3. desktop-page-02.jpg: Footer contains existing placeholder contact details. Kept unchanged under the explicit scope restriction; About itself uses the supplied exact address and no invented hotline/email/hours.

## Imagery and owner confirmation

All four photographs were already in the repo; no new download, hotlink, generated venue, staff portrait or customer claim. Existing attribution is retained in the unchanged Footer's photo-credits disclosure and `frontend/src/assets/images/services/credits.json`:

- “Dog shower, animal photography” — creator unspecified by source, CC0, rawpixel: https://www.rawpixel.com/image/6025967/photo-image-public-domain-person-dog
- “White Shih tzu Trimmed” — Cenedlaetholwr Cymreig, CC BY-SA 3.0, Wikimedia Commons: https://commons.wikimedia.org/w/index.php?curid=98875190
- “Brushing Out the Pyrenees 2” — Monkey Mash Button, CC BY-SA 2.0, Flickr: https://www.flickr.com/photos/62698615@N08/7192358190
- “Sage Mix” — anglerp1, CC BY-SA 2.0, Flickr: https://www.flickr.com/photos/88869149@N00/457382511

Images are displayed with CSS cropping, not rewritten/recoloured into new assets; original source files and their licence records are unchanged. No dealt coastal photographs, invented drawings or footage were used.

Owner should confirm the editorial brand-story wording and care aspirations, and optionally replace stock images with authorized MEOMEO photography. Service names/durations match existing frontend service data. No medical, hotel, food, accessory, absolute-safety or unsupported staff-experience claims were added. No fabricated testimonials or business statistics.
