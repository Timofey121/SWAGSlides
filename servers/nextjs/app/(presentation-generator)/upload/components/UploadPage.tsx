/**
 * UploadPage Component
 * 
 * This component handles the presentation generation upload process, allowing users to:
 * - Configure presentation settings (slides, language)
 * - Input prompts
 * - Upload supporting documents
 * 
 * @component
 */

"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearOutlines, setPresentationId } from "../../../../store/slices/presentationGeneration";
import { ConfigurationSelects } from "./ConfigurationSelects";
import { PromptInput } from "./PromptInput";
import {  AudienceType, LanguageType, PresentationConfig, ToneType, VerbosityType } from "../type";
import SupportingDoc from "./SupportingDoc";
import { Button } from "../../../../components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { PresentationGenerationApi } from "../../services/api/presentation-generation";
import { OverlayLoader } from "../../../../components/ui/overlay-loader";
import Wrapper from "../../../../components/Wrapper";
import { setPptGenUploadState, updatePptGenUploadConfig } from "../../../../store/slices/presentationGenUpload";
import { trackEvent, MixpanelEvent } from "../../../../utils/mixpanel";
import { t } from "../../i18n";
import { buildAudienceHardInstructions, clampSlidesForAudience, getDefaultSlidesForAudience } from "../audienceRules";
import { RootState } from "../../../../store/store";

// Types for loading state
interface LoadingState {
  isLoading: boolean;
  message: string;
  duration?: number;
  showProgress?: boolean;
  extra_info?: string;
}

const UploadPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // State management
  const [files, setFiles] = useState<File[]>([]);
  const config = useSelector((state: RootState) => state.pptGenUpload.config) as PresentationConfig;

  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: "",
    duration: 4,
    showProgress: false,
    extra_info: "",
  });

  /**
   * Updates the presentation configuration
   * @param key - Configuration key to update
   * @param value - New value for the configuration
   */
  const handleConfigChange = (key: keyof PresentationConfig, value: any) => {
    const prev = config;
    const next = (() => {
      // When the audience changes, enforce sensible defaults and constraints.
      if (key === "audience") {
        const nextAudience = value as AudienceType;
        const nextSlides = clampSlidesForAudience(
          nextAudience,
          prev.slides ?? getDefaultSlidesForAudience(nextAudience)
        );
        return {
          ...prev,
          audience: nextAudience,
          slides: nextSlides,
          includeTitleSlide: true,
        };
      }

      if (key === "slides") {
        const nextSlides = clampSlidesForAudience(prev.audience, value);
        const n = Number(nextSlides);
        const shouldAutoToc =
          prev.audience !== AudienceType.AgencyColdKP &&
          Number.isFinite(n) &&
          n > 20;
        return {
          ...prev,
          slides: nextSlides,
          includeTableOfContents: shouldAutoToc ? true : prev.includeTableOfContents,
        };
      }

      if (key === "includeTitleSlide") {
        // Title slide is mandatory for all supported audiences.
        return { ...prev, includeTitleSlide: true };
      }

      return { ...prev, [key]: value };
    })();
    dispatch(updatePptGenUploadConfig(next));
  };

  /**
   * Validates the current configuration and files
   * @returns boolean indicating if the configuration is valid
   */
  const language = config?.language;
  const validateConfiguration = (): boolean => {
    if (!config.language || !config.slides) {
      toast.error(t(language, "selectSlidesAndLanguage"));
      return false;
    }

    if (!config.prompt.trim() && files.length === 0) {
      toast.error(t(language, "noPromptOrDocument"));
      return false;
    }
    return true;
  };

  /**
   * Handles the presentation generation process
   */
  const handleGeneratePresentation = async () => {
    if (!validateConfiguration()) return;

    try {
      const hasUploadedAssets = files.length > 0;

      if (hasUploadedAssets) {
        await handleDocumentProcessing();
      } else {
        await handleDirectPresentationGeneration();
      }
    } catch (error) {
      handleGenerationError(error);
    }
  };

  /**
   * Handles document processing
   */
  const handleDocumentProcessing = async () => {
    setLoadingState({
      isLoading: true,
      message: "Processing documents...",
      showProgress: true,
      duration: 90,
      extra_info: files.length > 0 ? "It might take a few minutes for large documents." : "",
    });

    let documents = [];

    if (files.length > 0) {
      trackEvent(MixpanelEvent.Upload_Upload_Documents_API_Call);
      const uploadResponse = await PresentationGenerationApi.uploadDoc(files);
      documents = uploadResponse;
    }

    const promises: Promise<any>[] = [];

    if (documents.length > 0) {
      trackEvent(MixpanelEvent.Upload_Decompose_Documents_API_Call);
      promises.push(PresentationGenerationApi.decomposeDocuments(documents));
    }
    const responses = await Promise.all(promises);
    dispatch(setPptGenUploadState({
      config,
      files: responses,
    }));
    dispatch(clearOutlines())
    trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/documents-preview" });
    router.push("/documents-preview");
  };

  /**
   * Handles direct presentation generation without documents
   */
  const handleDirectPresentationGeneration = async () => {
    setLoadingState({
      isLoading: true,
      message: "Generating outlines...",
      showProgress: true,
      duration: 30,
    });

    // Use the first available layout group for direct generation
    trackEvent(MixpanelEvent.Upload_Create_Presentation_API_Call);
    const hardRules = buildAudienceHardInstructions(config.audience, config.slides);
    const effectiveInstructions =
      (config?.instructions || "").trim().length > 0
        ? `${hardRules}\n\n# Additional user instructions\n${config.instructions.trim()}`
        : hardRules;
    const slidesN = config?.slides ? Math.max(1, parseInt(config.slides, 10) || 1) : null;
    const createResponse = await PresentationGenerationApi.createPresentation({
      content: config?.prompt ?? "",
      n_slides: slidesN ?? 10,
      file_paths: [],
      language: config?.language ?? "",
      tone: config?.tone,
      verbosity: config?.verbosity,
      instructions: effectiveInstructions,
      include_table_of_contents: !!config?.includeTableOfContents,
      include_title_slide: true,
      web_search: !!config?.webSearch,
    });


    dispatch(setPresentationId(createResponse.id));
    dispatch(clearOutlines())
    trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/outline" });
    router.push("/outline");
  };

  /**
   * Handles errors during presentation generation
   */
  const handleGenerationError = (error: any) => {
    console.error("Error in upload page", error);
    setLoadingState({
      isLoading: false,
      message: "",
      duration: 0,
      showProgress: false,
    });
    toast.error("Error", {
      description: error.message || "Error in upload page.",
    });
  };

  return (
    <Wrapper className="pb-10 lg:max-w-[70%] xl:max-w-[65%]">
      <OverlayLoader
        show={loadingState.isLoading}
        text={loadingState.message}
        showProgress={loadingState.showProgress}
        duration={loadingState.duration}
        extra_info={loadingState.extra_info}
      />
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-semibold font-instrument_sans text-foreground">
          {config.language === LanguageType.English
            ? "Create presentation"
            : "Создать презентацию"}
        </h1>
      </div>
      <div className="flex flex-col gap-4 md:items-center md:flex-row justify-between py-4">
        <p></p>
        <ConfigurationSelects
          config={config}
          onConfigChange={handleConfigChange}
        />
      </div>

      <div className="relative">
        <PromptInput
          value={config.prompt}
          onChange={(value) => handleConfigChange("prompt", value)}
          data-testid="prompt-input"
        />
      </div>
      <SupportingDoc
        files={[...files]}
        onFilesChange={setFiles}
        data-testid="file-upload-input"
      />
      <Button
        onClick={handleGeneratePresentation}
        className="w-full rounded-[32px] flex items-center justify-center py-6 bg-primary text-primary-foreground font-instrument_sans font-semibold text-xl hover:bg-primary/90 transition-colors duration-300"
        data-testid="next-button"
      >
        <span>{config.language === LanguageType.English ? "Next" : "Далее"}</span>
        <ChevronRight className="!w-6 !h-6" />
      </Button>
    </Wrapper>
  );
};

export default UploadPage;
