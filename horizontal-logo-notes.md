# Horizontal Header Logo

The requested header lockup is built from the exact original `public/Logo.png` artwork. The original emblem and original GlobeDk / ELITE wordmark were extracted from that file, their outer white canvas was removed, and they were composed side-by-side into `public/Logo-horizontal-original.png`.

The header and mobile variants now use the horizontal lockup. The footer retains the original full vertical logo with the outer canvas removed. No generated reinterpretation or inline SVG redesign is used for visible branding.

## Clipping diagnosis

The rendered desktop screenshot showed the first and last wordmark letters clipped. Inspection of `Logo-original-transparent.png` confirms the complete original wordmark begins at the left edge of the transparent crop and ends at the right edge. The in-progress composer incorrectly used `x=75` and `x=width-55`, which cut into the original G and K. The next deterministic composition must crop the wordmark from the complete original bounds, using only alpha bounding-box padding and no invented artwork.

## Verification update

After rebuilding the asset with the full wordmark crop, the 1440px desktop and 390px mobile renders show the original `GlobeDk` wordmark completely, including the G and K, with the emblem and ELITE line visible and no square canvas surrounding the mark.

The 257px narrow render also keeps the full horizontal lockup visible without horizontal page overflow. The production build completed successfully with the repository's documented placeholder environment variables, and `git diff --check` passed.
