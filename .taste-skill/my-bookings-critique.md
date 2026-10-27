# Taste review — Lịch đặt của tôi

Screen question: Lịch nào của khách sắp tới, và khách có thể mở từng lịch ở đâu?

Direction: `achromatic-ledger` (seed 1897751491), adapted to the existing MEOMEO palette and a local Arial/Segoe UI system font for Vietnamese glyph coverage. The list uses the requested underline filters instead of the sheet's count cards. Its signature is a date-led appointment record with one warm marker on the next booking. The existing PetAvatar SVGs stand in for pet photos until photo URLs exist.

Typography update: the page now declares `lang="vi"`, uses no external font dependency, and raises the page title to 36px and content text to 14–22px. Production desktop review at 1440px showed correct Vietnamese diacritics and no horizontal overflow. The inspector warns that the 36px title exceeds its default app-title size; it stays larger per the user's request. The shared header/footer still use the site's existing font rules. Scores in the rounds below predate this typography update.

## ROUND 1

Seen in one second: The production page was blank because `formatVnd` was not imported.
Idea (one sentence): A date-led list makes the next spa visit easiest to find.
Live thing: None until the runtime error was fixed.
Layout words by section: header=none / filters=none / appointments=none
Scores: design 1 · usability 1 · creativity 1 · content 1 → overall 1.0
Caps applied: Runtime exception left the screen empty.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `my-bookings-after/desktop-fold.jpg` was blank; import the existing VND formatter.
2. No heading or list could render; resolve the runtime exception before reviewing the layout.
3. The footer was the only visible content; keep it untouched and inspect again after the page renders.

## ROUND 2

Seen in one second: A spacious customer booking list with the next appointment first.
Idea (one sentence): Dates lead a warm, editorial list of pet spa visits.
Live thing: Customers can filter all, upcoming, completed and cancelled appointments.
Layout words by section: header=plain title / filters=underline / appointments=editorial rows / footer=dark close
Scores: design 7 · usability 8 · creativity 7 · content 8 → overall 6.0 (uncapped 7.4)
Caps applied: Inspector flagged page-level `data-ui`, pet icon backplates and inherited shared-footer contrast.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `my-bookings-after/desktop-fold.jpg`: pet silhouettes sat in tinted circles; remove the backplates while keeping the existing pet drawings.
2. `my-bookings-after/desktop-fold.jpg`: the page ground read as yellow cream; switch to a low-chroma stone and keep MEOMEO yellow on a small data marker.
3. `my-bookings-after/desktop-page-01.jpg`: `data-ui` wrapped the full page; remove that marker because this is the whole screen, not a cropped interface fragment.

## ROUND 3

Seen in one second: A clear MEOMEO appointment list with dates, pets, services, payment state and detail links.
Idea (one sentence): The next visit anchors a breathable record of each pet's spa history.
Live thing: The four filters change the visible records; each detail link carries its numeric booking ID.
Layout words by section: header=plain title / filters=underline / appointments=editorial rows / footer=dark close
Scores: design 7.5 · usability 8 · creativity 7 · content 8 → overall 6.0 (uncapped 7.6)
Caps applied: Inspector caps the score because it reports contrast in the unchanged shared footer; the screenshot shows its dark field is supplied by a `::before` pseudo-element, which the contrast probe does not account for. It also warns that the shared body font `Nunito Sans` is not loaded; the page itself uses loaded General Sans.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `my-bookings-after/desktop-page-01.jpg`: the inherited footer contrast probe remains unresolved without changing the shared footer, which the task forbids.
2. `my-bookings-after/desktop-page-01.jpg`: mock pets use the existing illustrated fallback because no individual pet photos are available; replace `imageUrl` with real pet images when the API supplies them.
3. `my-bookings-after/desktop-page-01.jpg`: the shared shell still declares an unloaded `Nunito Sans`; correcting it would change other pages, so the bookings page keeps its scoped loaded General Sans face.
