import { AudienceType } from "./type";

function normalizeSlides(slides: string | null | undefined): number | null {
  if (!slides) return null;
  const n = Number(slides);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export function getDefaultSlidesForAudience(audience: AudienceType): string {
  switch (audience) {
    case AudienceType.AgencyColdKP:
      return "6";
    case AudienceType.Consulting:
    case AudienceType.Education:
    default:
      return "10";
  }
}

export function clampSlidesForAudience(
  audience: AudienceType,
  slides: string | null | undefined
): string {
  const n = normalizeSlides(slides);
  const fallback = getDefaultSlidesForAudience(audience);
  if (!n) return fallback;

  if (audience === AudienceType.AgencyColdKP) {
    if (n < 3) return "3";
    if (n > 6) return "6";
  }

  return String(n);
}

const commonDesignRules = `
# Non‑negotiable slide rules (apply to every slide)
- Action Title Principle: the title must state the key takeaway as a complete sentence (no topic titles).
- One slide = one conclusion. No multiple unrelated points per slide.
- Pyramid principle (Minto): lead with the answer, then 2–4 supporting points.
- Use MECE when you list arguments, buckets, options or root causes.
- Use left alignment and clean spacing. Avoid fluff.

# Chart selection (choose the simplest chart that answers the question)
- Category comparison → horizontal bar chart
- Change over time → line chart
- Part-to-whole → stacked bar chart or treemap
- Correlation → scatter plot with trendline
- Distribution → histogram or box plot
- Process/flow → Sankey diagram or simple process flow

# Data Visualization Hierarchy (keep it readable)
- Use contrast colors for key insights.
- Use grey for secondary/supporting text and less important information.
- Highlight key numbers with larger text.
- Use simple charts; prefer labels directly on charts instead of legends.

# Typography (default if no brandbook)
- Sans-serif: Arial, Helvetica, Calibri (or brand fonts if provided)
- Title: 24–28 pt
- Body: 16–18 pt
- Chart labels: 12–14 pt
- Left alignment; line spacing: 1.5–2.0
`.trim();

export function buildAudienceHardInstructions(
  audience: AudienceType,
  slides: string | null | undefined
): string {
  const n = normalizeSlides(slides);
  const deckSizeLine = n ? `Deck length: ${n} slides.` : "Deck length: use the requested number of slides.";

  if (audience === AudienceType.Education) {
    return `
# Audience: Educational presentation (Учебные презы)
${deckSizeLine}

## Mandatory structure
- Default: 10 slides (can be increased in settings).
- Pyramid principle (Minto) on every slide.
- MECE framework for arguments.
- Slide 1 (Title):
  - Presentation title
  - Date
  - Presenter name
- If the deck is longer than 20 slides, include a Table of Contents immediately after the title.

${commonDesignRules}
`.trim();
  }

  if (audience === AudienceType.AgencyColdKP) {
    return `
# Audience: Agency cold commercial proposal (холодные КП)
${deckSizeLine}

## Mandatory structure (3–6 slides total, incl. title and closing)
- Slide 1 (Title): agency logo + client logo (placeholders if missing)
  - Subtitle: "Коммерческое предложение для {заказчик} по {суть того, что предлагают}"
- Slide 2: the client's problem (money loss framing) + SWOT
  - In Threats: always include competition risk + loss of market share
  - Include 3 direct competitors of the client
- Slides 3–4: what we propose
  - Focus on 1–2 key needs and build the offer around them
- Slide 5: relevant agency cases + objection handling (guarantees, refund, FAQs)
- Slide 6: team (role + why strong) + minimal pricing + strong CTA + contacts
  - Motivate the target action: contact, request price list, schedule a meeting
  - Include deadline or promo if applicable

## Brandbook requirement
- Agency must upload brandbook with corporate colors, fonts, and elements. Use them consistently.

## Reference style (cold KP best practices)
- Follow best practices from Sber, Tinkoff-Journal, and agency tender communications (e.g. SIBUR).

${commonDesignRules}
`.trim();
  }

  // Consulting
  return `
# Audience: Consulting
${deckSizeLine}

## Mandatory structure
- Default: 10 slides (can be increased in settings).
- Pyramid principle (Minto) on every slide.
- MECE framework for arguments.
- Situation–Complication–Resolution framework must be explicit in the story.
- Slide 1 (Title):
  - Presentation title = what you're recommending
  - Client name
  - Date
  - Presenter name
- Slide 2 (Executive summary):
  - Key conclusion
  - Key numbers (2–4)
  - Key recommendation
  - "So what": impact + next steps
- If the deck is longer than 20 slides, include a Table of Contents immediately after the title.

${commonDesignRules}
`.trim();
}
