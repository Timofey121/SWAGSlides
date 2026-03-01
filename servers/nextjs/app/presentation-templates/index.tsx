import {
  TemplateGroupSettings,
  TemplateLayoutsWithSettings,
  TemplateWithData,
  createTemplateEntry,
} from "./utils";

// Shared layouts (re-used across audiences)
import GeneralIntroSlideLayout, {
  Schema as GeneralIntroSchema,
  layoutId as GeneralIntroId,
  layoutName as GeneralIntroName,
  layoutDescription as GeneralIntroDesc,
} from "./general/IntroSlideLayout";
import TableOfContentsSlideLayout, {
  Schema as TocSchema,
  layoutId as TocId,
  layoutName as TocName,
  layoutDescription as TocDesc,
} from "./general/TableOfContentsSlideLayout";
import NumberedBulletsSlideLayout, {
  Schema as NumberedBulletsSchema,
  layoutId as NumberedBulletsId,
  layoutName as NumberedBulletsName,
  layoutDescription as NumberedBulletsDesc,
} from "./general/NumberedBulletsSlideLayout";
import BulletWithIconsSlideLayout, {
  Schema as BulletWithIconsSchema,
  layoutId as BulletWithIconsId,
  layoutName as BulletWithIconsName,
  layoutDescription as BulletWithIconsDesc,
} from "./general/BulletWithIconsSlideLayout";
import ChartWithBulletsSlideLayout, {
  Schema as ChartWithBulletsSchema,
  layoutId as ChartWithBulletsId,
  layoutName as ChartWithBulletsName,
  layoutDescription as ChartWithBulletsDesc,
} from "./general/ChartWithBulletsSlideLayout";
import MetricsSlideLayout, {
  Schema as MetricsSchema,
  layoutId as MetricsId,
  layoutName as MetricsName,
  layoutDescription as MetricsDesc,
} from "./general/MetricsSlideLayout";
import TeamSlideLayout, {
  Schema as TeamSchema,
  layoutId as TeamId,
  layoutName as TeamName,
  layoutDescription as TeamDesc,
} from "./general/TeamSlideLayout";
import QuoteSlideLayout, {
  Schema as QuoteSchema,
  layoutId as QuoteId,
  layoutName as QuoteName,
  layoutDescription as QuoteDesc,
} from "./general/QuoteSlideLayout";

// Consulting-heavy layouts
import TextSplitWithEmphasisBlockLayout, {
  Schema as TextSplitWithEmphasisBlockSchema,
  layoutId as TextSplitWithEmphasisBlockId,
  layoutName as TextSplitWithEmphasisBlockName,
  layoutDescription as TextSplitWithEmphasisBlockDesc,
} from "./neo-general/TextSplitWithEmphasisBlock";
import TitleWithFullWidthChartLayout, {
  Schema as TitleWithFullWidthChartSchema,
  layoutId as TitleWithFullWidthChartId,
  layoutName as TitleWithFullWidthChartName,
  layoutDescription as TitleWithFullWidthChartDesc,
} from "./neo-general/TitleWithFullWidthChart";
import TitleMetricsWithChartLayout, {
  Schema as TitleMetricsWithChartSchema,
  layoutId as TitleMetricsWithChartId,
  layoutName as TitleMetricsWithChartName,
  layoutDescription as TitleMetricsWithChartDesc,
} from "./neo-general/TitleMetricsWithChart";
import TitleDescriptionWithTableLayout, {
  Schema as TitleDescriptionWithTableSchema,
  layoutId as TitleDescriptionWithTableId,
  layoutName as TitleDescriptionWithTableName,
  layoutDescription as TitleDescriptionWithTableDesc,
} from "./neo-general/TitleDescriptionWithTable";
import TitleThreeColumnRiskConstraintsLayout, {
  Schema as TitleThreeColumnRiskConstraintsSchema,
  layoutId as TitleThreeColumnRiskConstraintsId,
  layoutName as TitleThreeColumnRiskConstraintsName,
  layoutDescription as TitleThreeColumnRiskConstraintsDesc,
} from "./neo-general/TitleThreeColumnRiskConstraints";
import TimelineLayout, {
  Schema as TimelineLayoutSchema,
  layoutId as TimelineLayoutId,
  layoutName as TimelineLayoutName,
  layoutDescription as TimelineLayoutDesc,
} from "./neo-general/Timeline";
import ThankYouContactInfoFooterImageSlideLayout, {
  Schema as ThankYouContactInfoFooterImageSlideSchema,
  layoutId as ThankYouContactInfoFooterImageSlideId,
  layoutName as ThankYouContactInfoFooterImageSlideName,
  layoutDescription as ThankYouContactInfoFooterImageSlideDesc,
} from "./neo-general/ThankYouContactInfoFooterImageSlide";

const consultingSettings: TemplateGroupSettings = {
  description:
    "Consulting decks: Minto pyramid, MECE, SCR, action titles, data-driven storytelling.",
  ordered: false,
  default: true,
};

const agencySettings: TemplateGroupSettings = {
  description:
    "Agency cold commercial proposals (КП): short 3–6 slides, problem framing + SWOT, offer, cases, team, CTA.",
  ordered: false,
  default: false,
};

const educationSettings: TemplateGroupSettings = {
  description:
    "Educational presentations: clear structure, one takeaway per slide, simple visuals.",
  ordered: false,
  default: false,
};

export const consultingTemplates: TemplateWithData[] = [
  createTemplateEntry(
    GeneralIntroSlideLayout,
    GeneralIntroSchema,
    GeneralIntroId,
    GeneralIntroName,
    GeneralIntroDesc,
    "consulting",
    "IntroSlideLayout"
  ),
  createTemplateEntry(
    TextSplitWithEmphasisBlockLayout,
    TextSplitWithEmphasisBlockSchema,
    TextSplitWithEmphasisBlockId,
    TextSplitWithEmphasisBlockName,
    TextSplitWithEmphasisBlockDesc,
    "consulting",
    "TextSplitWithEmphasisBlock"
  ),
  createTemplateEntry(
    TitleMetricsWithChartLayout,
    TitleMetricsWithChartSchema,
    TitleMetricsWithChartId,
    TitleMetricsWithChartName,
    TitleMetricsWithChartDesc,
    "consulting",
    "TitleMetricsWithChart"
  ),
  createTemplateEntry(
    TitleWithFullWidthChartLayout,
    TitleWithFullWidthChartSchema,
    TitleWithFullWidthChartId,
    TitleWithFullWidthChartName,
    TitleWithFullWidthChartDesc,
    "consulting",
    "TitleWithFullWidthChart"
  ),
  createTemplateEntry(
    TitleDescriptionWithTableLayout,
    TitleDescriptionWithTableSchema,
    TitleDescriptionWithTableId,
    TitleDescriptionWithTableName,
    TitleDescriptionWithTableDesc,
    "consulting",
    "TitleDescriptionWithTable"
  ),
  createTemplateEntry(
    TitleThreeColumnRiskConstraintsLayout,
    TitleThreeColumnRiskConstraintsSchema,
    TitleThreeColumnRiskConstraintsId,
    TitleThreeColumnRiskConstraintsName,
    TitleThreeColumnRiskConstraintsDesc,
    "consulting",
    "TitleThreeColumnRiskConstraints"
  ),
  createTemplateEntry(
    NumberedBulletsSlideLayout,
    NumberedBulletsSchema,
    NumberedBulletsId,
    NumberedBulletsName,
    NumberedBulletsDesc,
    "consulting",
    "NumberedBulletsSlideLayout"
  ),
  createTemplateEntry(
    ChartWithBulletsSlideLayout,
    ChartWithBulletsSchema,
    ChartWithBulletsId,
    ChartWithBulletsName,
    ChartWithBulletsDesc,
    "consulting",
    "ChartWithBulletsSlideLayout"
  ),
  createTemplateEntry(
    TimelineLayout,
    TimelineLayoutSchema,
    TimelineLayoutId,
    TimelineLayoutName,
    TimelineLayoutDesc,
    "consulting",
    "Timeline"
  ),
  createTemplateEntry(
    TableOfContentsSlideLayout,
    TocSchema,
    TocId,
    TocName,
    TocDesc,
    "consulting",
    "TableOfContentsSlideLayout"
  ),
  createTemplateEntry(
    ThankYouContactInfoFooterImageSlideLayout,
    ThankYouContactInfoFooterImageSlideSchema,
    ThankYouContactInfoFooterImageSlideId,
    ThankYouContactInfoFooterImageSlideName,
    ThankYouContactInfoFooterImageSlideDesc,
    "consulting",
    "ThankYouContactInfoFooterImageSlide"
  ),
];

export const agencyColdKpTemplates: TemplateWithData[] = [
  createTemplateEntry(
    GeneralIntroSlideLayout,
    GeneralIntroSchema,
    GeneralIntroId,
    GeneralIntroName,
    GeneralIntroDesc,
    "agency-kp",
    "IntroSlideLayout"
  ),
  createTemplateEntry(
    TitleThreeColumnRiskConstraintsLayout,
    TitleThreeColumnRiskConstraintsSchema,
    TitleThreeColumnRiskConstraintsId,
    TitleThreeColumnRiskConstraintsName,
    TitleThreeColumnRiskConstraintsDesc,
    "agency-kp",
    "TitleThreeColumnRiskConstraints"
  ),
  createTemplateEntry(
    BulletWithIconsSlideLayout,
    BulletWithIconsSchema,
    BulletWithIconsId,
    BulletWithIconsName,
    BulletWithIconsDesc,
    "agency-kp",
    "BulletWithIconsSlideLayout"
  ),
  createTemplateEntry(
    MetricsSlideLayout,
    MetricsSchema,
    MetricsId,
    MetricsName,
    MetricsDesc,
    "agency-kp",
    "MetricsSlideLayout"
  ),
  createTemplateEntry(
    TeamSlideLayout,
    TeamSchema,
    TeamId,
    TeamName,
    TeamDesc,
    "agency-kp",
    "TeamSlideLayout"
  ),
  createTemplateEntry(
    ThankYouContactInfoFooterImageSlideLayout,
    ThankYouContactInfoFooterImageSlideSchema,
    ThankYouContactInfoFooterImageSlideId,
    ThankYouContactInfoFooterImageSlideName,
    ThankYouContactInfoFooterImageSlideDesc,
    "agency-kp",
    "ThankYouContactInfoFooterImageSlide"
  ),
];

export const educationTemplates: TemplateWithData[] = [
  createTemplateEntry(
    GeneralIntroSlideLayout,
    GeneralIntroSchema,
    GeneralIntroId,
    GeneralIntroName,
    GeneralIntroDesc,
    "education",
    "IntroSlideLayout"
  ),
  createTemplateEntry(
    NumberedBulletsSlideLayout,
    NumberedBulletsSchema,
    NumberedBulletsId,
    NumberedBulletsName,
    NumberedBulletsDesc,
    "education",
    "NumberedBulletsSlideLayout"
  ),
  createTemplateEntry(
    BulletWithIconsSlideLayout,
    BulletWithIconsSchema,
    BulletWithIconsId,
    BulletWithIconsName,
    BulletWithIconsDesc,
    "education",
    "BulletWithIconsSlideLayout"
  ),
  createTemplateEntry(
    ChartWithBulletsSlideLayout,
    ChartWithBulletsSchema,
    ChartWithBulletsId,
    ChartWithBulletsName,
    ChartWithBulletsDesc,
    "education",
    "ChartWithBulletsSlideLayout"
  ),
  createTemplateEntry(
    QuoteSlideLayout,
    QuoteSchema,
    QuoteId,
    QuoteName,
    QuoteDesc,
    "education",
    "QuoteSlideLayout"
  ),
  createTemplateEntry(
    TableOfContentsSlideLayout,
    TocSchema,
    TocId,
    TocName,
    TocDesc,
    "education",
    "TableOfContentsSlideLayout"
  ),
  createTemplateEntry(
    ThankYouContactInfoFooterImageSlideLayout,
    ThankYouContactInfoFooterImageSlideSchema,
    ThankYouContactInfoFooterImageSlideId,
    ThankYouContactInfoFooterImageSlideName,
    ThankYouContactInfoFooterImageSlideDesc,
    "education",
    "ThankYouContactInfoFooterImageSlide"
  ),
];

export const allLayouts: TemplateWithData[] = [
  ...consultingTemplates,
  ...agencyColdKpTemplates,
  ...educationTemplates,
];

export const templates: TemplateLayoutsWithSettings[] = [
  {
    id: "consulting",
    name: "Consulting",
    description: consultingSettings.description,
    settings: consultingSettings,
    layouts: consultingTemplates,
  },
  {
    id: "agency-kp",
    name: "Agency КП",
    description: agencySettings.description,
    settings: agencySettings,
    layouts: agencyColdKpTemplates,
  },
  {
    id: "education",
    name: "Education",
    description: educationSettings.description,
    settings: educationSettings,
    layouts: educationTemplates,
  },
];

export function getTemplatesByTemplateName(templateId: string): TemplateWithData[] {
  const template = templates.find((t) => t.id === templateId);
  return template?.layouts || [];
}

export function getSchemaByTemplateId(templateId: string): any {
  const template = templates.find((t) => t.id === templateId);
  return (
    template?.layouts.map((t) => {
      return {
        id: t.layoutId,
        name: t.layoutName,
        description: t.layoutDescription,
        json_schema: t.schemaJSON,
      };
    }) || {}
  );
}

export function getSettingsByTemplateId(
  templateId: string
): TemplateGroupSettings | undefined {
  const template = templates.find((t) => t.id === templateId);
  return template?.settings || undefined;
}

export function getTemplateByLayoutId(
  layoutId: string
): TemplateWithData | undefined {
  return allLayouts.find((t) => t.layoutId === layoutId);
}

export function getLayoutByLayoutId(layout: string): TemplateWithData | undefined {
  const templateName = layout.split(":")[0];
  const template = templates.find((t) => t.id === templateName);
  if (template) {
    return template.layouts.find((t) => t.layoutId === layout);
  }
  return undefined;
}

