import { NextResponse } from "next/server";
import { TemplateSetting } from "../../(presentation-generator)/template-preview/types";

export async function GET() {
  // IMPORTANT: Keep this route server-safe.
  // Do not import presentation template React components here (breaks Next build).
  const templates: {
    templateName: string;
    templateID: string;
    files: string[];
    settings: TemplateSetting;
  }[] = [
    {
      templateName: "Consulting",
      templateID: "consulting",
      files: [],
      settings: {
        description:
          "Consulting decks: Minto pyramid, MECE, SCR, action titles, data-driven storytelling.",
        ordered: false,
        default: true,
      },
    },
    {
      templateName: "Agency КП",
      templateID: "agency-kp",
      files: [],
      settings: {
        description:
          "Agency cold commercial proposals (КП): short 3–6 slides, problem framing + SWOT, offer, cases, team, CTA.",
        ordered: false,
        default: false,
      },
    },
    {
      templateName: "Education",
      templateID: "education",
      files: [],
      settings: {
        description:
          "Educational presentations: clear structure, one takeaway per slide, simple visuals.",
        ordered: false,
        default: false,
      },
    },
  ];

  return NextResponse.json(templates);
} 