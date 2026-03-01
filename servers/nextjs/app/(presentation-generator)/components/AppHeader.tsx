"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import Wrapper from "../../../components/Wrapper";
import BackBtn from "../../../components/BackBtn";
import { RootState } from "../../../store/store";
import { LanguageType } from "../upload/type";
import { updatePptGenUploadConfig } from "../../../store/slices/presentationGenUpload";
import { clearOutlines, clearPresentationData } from "../../../store/slices/presentationGeneration";
import { clearHistory } from "../../../store/slices/undoRedoSlice";
import { PresentationGenerationApi } from "../services/api/presentation-generation";
import { t } from "../i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const config = useSelector((state: RootState) => state.pptGenUpload.config);
  const presentationId = useSelector(
    (state: RootState) => state.presentationGeneration.presentation_id
  );

  const languageValue = (config?.language as string) || LanguageType.Russian;
  const lang = config?.language;

  const handleLanguageChange = async (language: LanguageType) => {
    dispatch(updatePptGenUploadConfig({ language }));

    // Keep backend in sync so streaming/generation uses the selected language.
    if (presentationId) {
      try {
        await PresentationGenerationApi.updatePresentationContent({
          id: presentationId,
          language,
        });
      } catch {}
    }

    // Force outlines re-stream on outline page.
    if (pathname === "/outline") {
      dispatch(clearOutlines());
    }

    // On presentation page, language change should be visible immediately:
    // regenerate slides in the selected language.
    if (pathname === "/presentation" && presentationId) {
      dispatch(clearPresentationData());
      dispatch(clearHistory());
      router.replace(`/presentation?id=${presentationId}&stream=true&type=standard`);
    }
  };

  return (
    <div className="bg-primary w-full shadow-lg sticky top-0 z-50">
      <Wrapper>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            {pathname !== "/upload" && pathname !== "/dashboard" && <BackBtn />}
            <Link href="/upload" className="inline-flex items-center">
              <span className="text-white text-2xl font-bold tracking-tight">
                SWAGSlides
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={languageValue}
              onValueChange={(value) =>
                handleLanguageChange(value as LanguageType)
              }
              name="language"
            >
              <SelectTrigger className="w-[170px] bg-white/15 text-white border-white/30 focus-visible:ring-white/30">
                <SelectValue placeholder={t(lang, "language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LanguageType.Russian}>Русский</SelectItem>
                <SelectItem value={LanguageType.English}>English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

