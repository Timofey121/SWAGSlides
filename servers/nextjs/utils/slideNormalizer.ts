/**
 * Нормализует слайды презентации — убирает битые записи и дополняет недостающие поля.
 * Гарантирует, что каждый слайд имеет id, index, content, layout, layout_group.
 */
export interface NormalizedSlide {
  id: string;
  index: number;
  type?: number;
  design_index?: number | null;
  images?: string[] | null;
  properties?: null | Record<string, unknown>;
  icons?: string[] | null;
  graph_id?: string | null;
  presentation?: string;
  speaker_note?: string;
  layout: string;
  layout_group: string;
  content: Record<string, unknown>;
}

function isSlideValid(slide: unknown): slide is Record<string, unknown> {
  return slide !== null && typeof slide === "object";
}

function ensureContent(slide: Record<string, unknown>): Record<string, unknown> {
  const content = slide.content;
  if (content !== null && typeof content === "object") {
    return content as Record<string, unknown>;
  }
  return {};
}

function ensureLayout(slide: Record<string, unknown>): string {
  const layout = slide.layout;
  if (typeof layout === "string" && layout.trim().length > 0) {
    return layout;
  }
  return "default:default";
}

function ensureLayoutGroup(slide: Record<string, unknown>): string {
  const group = slide.layout_group;
  if (typeof group === "string" && group.trim().length > 0) {
    return group;
  }
  return "default";
}

function ensureId(slide: Record<string, unknown>, index: number): string {
  const id = slide.id;
  if (typeof id === "string" && id.trim().length > 0) {
    return id;
  }
  return `slide-${index}`;
}

/**
 * Нормализует массив слайдов: фильтрует невалидные и дополняет обязательные поля.
 */
export function normalizeSlides(slides: unknown): NormalizedSlide[] {
  if (!Array.isArray(slides)) {
    return [];
  }

  return slides
    .filter(isSlideValid)
    .map((slide, idx) => {
      const content = ensureContent(slide);
      const layout = ensureLayout(slide);
      const layoutGroup = ensureLayoutGroup(slide);
      const id = ensureId(slide, idx);
      const index = typeof slide.index === "number" ? slide.index : idx;

      return {
        ...slide,
        id,
        index,
        content,
        layout,
        layout_group: layoutGroup,
      } as NormalizedSlide;
    });
}

/**
 * Нормализует presentationData: slides и другие поля.
 */
export function normalizePresentationData(data: unknown): {
  id: string;
  language: string;
  layout: { name: string; ordered: boolean; slides: unknown[] };
  n_slides: number;
  title: string;
  slides: NormalizedSlide[];
} | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const obj = data as Record<string, unknown>;
  const rawSlides = obj.slides;
  const slides = normalizeSlides(
    Array.isArray(rawSlides) ? rawSlides : []
  );

  return {
    id: typeof obj.id === "string" ? obj.id : "",
    language: typeof obj.language === "string" ? obj.language : "en",
    layout:
      obj.layout && typeof obj.layout === "object"
        ? (obj.layout as { name: string; ordered: boolean; slides: unknown[] })
        : { name: "default", ordered: true, slides: [] },
    n_slides: typeof obj.n_slides === "number" ? obj.n_slides : slides.length,
    title: typeof obj.title === "string" ? obj.title : "",
    slides,
  };
}
