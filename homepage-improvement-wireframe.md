# Homepage Improvement Wireframe

## Design intent

The revised homepage keeps the existing GlobeDk visual identity but changes the content rhythm. The first screen should communicate the offer, show one proof cue, and expose one primary action before asking the visitor to read the full subject catalogue.

## Desktop wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LOGO / GlobeDk Elite Academy     Home About Subjects Timetable Contact  [Enroll]│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                         [WELCOME BADGE]                                     │
│                                                                              │
│              Online O-Level & A-Level Lessons                               │
│              for ZIMSEC & Cambridge Students                                │
│                                                                              │
│         Expert online tutoring for students in Zimbabwe.                   │
│         Learn with confidence. Prepare with purpose.                        │
│                                                                              │
│                 [ Enroll Now ]   [ Explore Subjects ]                       │
│                                                                              │
│       ✓ Live online classes   ✓ Flexible schedules   ✓ Exam preparation      │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ TRUST STRIP                                                                   │
│  Curriculum-aligned tutoring  |  One-to-one support  |  Harare-based team    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    What can we help you master?                             │
│                                                                              │
│   [Mathematics]       [Sciences]        [Languages & Humanities]             │
│   Short description    Short description  Short description                  │
│   [View subjects]      [View subjects]    [View subjects]                    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ LEARNING FORMATS                                                              │
│  Live online classes  |  One-to-one tutoring  |  Weekend & holiday revision  │
├──────────────────────────────────────────────────────────────────────────────┤
│ PROOF / TESTIMONIALS                                                          │
│  “Short parent or student quote.”                         [View testimonials]│
├──────────────────────────────────────────────────────────────────────────────┤
│ FINAL CTA                                                                     │
│  Ready to take the next step?                              [Speak to admissions]│
├──────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: brand | complete quick links | contact | social links                │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Mobile wireframe

```text
┌──────────────────────────────┐
│ [logo] GlobeDk          [≡]  │
├──────────────────────────────┤
│                              │
│       [WELCOME BADGE]        │
│                              │
│  Online O-Level & A-Level    │
│  Lessons for ZIMSEC &        │
│  Cambridge Students          │
│                              │
│  Expert tutoring for         │
│  students in Zimbabwe.       │
│                              │
│  [ Enroll Now ]              │
│  [ Explore Subjects ]        │
│                              │
│  ✓ Live classes              │
│  ✓ Flexible schedules        │
│  ✓ Exam preparation          │
│                              │
├──────────────────────────────┤
│ WHY FAMILIES CHOOSE US       │
│ Curriculum-aligned tutoring  │
│ One-to-one support           │
│ Harare-based team            │
├──────────────────────────────┤
│ SUBJECTS                     │
│ [Mathematics]                │
│ [Sciences]                   │
│ [Languages & Humanities]     │
│ [View all subjects]          │
├──────────────────────────────┤
│ LEARNING FORMATS             │
│ Live online classes          │
│ One-to-one tutoring          │
│ Revision support             │
├──────────────────────────────┤
│ TESTIMONIAL                  │
│ “Short quote.”               │
├──────────────────────────────┤
│ [Speak to admissions]        │
├──────────────────────────────┤
│ FOOTER                       │
└──────────────────────────────┘
```

## Interaction notes

The primary action should remain visible after the shortened hero, while the secondary action should lead to the Subjects page rather than repeating Contact Us. The full menu should open inside the viewport with `overflow-x: clip` or carefully contained animated decorations. Slideshow indicators should remain keyboard reachable and expose the active state semantically. Decorative animation should pause or simplify when the user has requested reduced motion.

## Content rules for the revised hero

The first screen should use one short supporting paragraph rather than three long paragraphs. The full subject catalogue should live on the Subjects page or in a dedicated subject-preview section. Proof points should be concrete and local to the CTA, such as curriculum alignment, class availability, or a response-time promise, provided those claims are accurate and approved by the academy.
