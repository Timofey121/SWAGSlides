import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearPresentationData } from "../../../../store/slices/presentationGeneration";
import { PresentationGenerationApi } from "../../services/api/presentation-generation";
import { Template, LoadingState, TABS } from "../types";
import { MixpanelEvent, trackEvent } from "../../../../utils/mixpanel";
import { TemplateLayoutsWithSettings } from "../../../presentation-templates/utils";
import { getCustomTemplateDetails } from "../../../hooks/useCustomTemplates";
import { RootState } from "../../../../store/store";
import { t } from "../../i18n";

const DEFAULT_LOADING_STATE: LoadingState = {
  message: "",
  isLoading: false,
  showProgress: false,
  duration: 0,
};

export const usePresentationGeneration = (
  presentationId: string | null,
  outlines: { content: string }[] | null,
  selectedTemplate: TemplateLayoutsWithSettings | string | null,
  setActiveTab: (tab: string) => void
) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const language = useSelector((state: RootState) => state.pptGenUpload.config?.language);
  const [loadingState, setLoadingState] = useState<LoadingState>(DEFAULT_LOADING_STATE);

  const validateInputs = useCallback(() => {
    if (!outlines || outlines.length === 0) {
      toast.error(t(language, "noOutlinesTitle"), {
        description: t(language, "noOutlinesBody"),
      });
      return false;
    }

    if (!selectedTemplate) {
      toast.error(t(language, "selectLayoutGroupTitle"), {
        description: t(language, "selectLayoutGroupBody"),
      });
      return false;
    }


    return true;
  }, [outlines, selectedTemplate]);



  const clearTheme = () => {
    const element = document.getElementById('presentation-page')
    if (!element) return;
    element.style.removeProperty('--primary-color');
    element.style.removeProperty('--background-color');
    element.style.removeProperty('--card-color');
    element.style.removeProperty('--stroke');
    element.style.removeProperty('--primary-text');
    element.style.removeProperty('--background-text');
    element.style.removeProperty('--graph-0');
    element.style.removeProperty('--graph-1');
    element.style.removeProperty('--graph-2');
    element.style.removeProperty('--graph-3');
    element.style.removeProperty('--graph-4');
    element.style.removeProperty('--graph-5');
    element.style.removeProperty('--graph-6');
    element.style.removeProperty('--graph-7');
    element.style.removeProperty('--graph-8');
    element.style.removeProperty('--graph-9');

  }

  const handleSubmit = useCallback(async () => {
    if (!selectedTemplate) {
      setActiveTab(TABS.LAYOUTS);
      return;
    }
    if (!validateInputs()) return;

    setLoadingState({
      message: t(language, "generatingPresentationData"),
      isLoading: true,
      showProgress: true,
      duration: 30,
    });

    try {
      let layout;

      // Check if it's a custom template (string = presentationId)
      if (typeof selectedTemplate === 'string') {
        setLoadingState({
          message: t(language, "loadingCustomTemplate"),
          isLoading: true,
          showProgress: true,
          duration: 30,
        });

        // Fetch custom template details using the shared function
        const customTemplateDetail = await getCustomTemplateDetails(selectedTemplate);

        if (!customTemplateDetail || customTemplateDetail.layouts.length === 0) {
          toast.error(t(language, "templateErrorTitle"), {
            description: t(language, "templateErrorBody"),
          });
          return;
        }

        setLoadingState({
          message: t(language, "generatingPresentationData"),
          isLoading: true,
          showProgress: true,
          duration: 30,
        });

        layout = {
          name: customTemplateDetail.id,
          ordered: false,
          slides: customTemplateDetail.layouts.map((compiledLayout) => ({
            id: customTemplateDetail.id.startsWith('custom-') ? `${customTemplateDetail.id}:${compiledLayout.layoutId}` : `custom-${customTemplateDetail.id}:${compiledLayout.layoutId}`,
            name: compiledLayout.layoutName,
            description: compiledLayout.layoutDescription,
            templateID: customTemplateDetail.id,
            templateName: customTemplateDetail.name,
            json_schema: compiledLayout.schemaJSON,
          }))
        };
      } else {
        // Built-in template
        layout = {
          name: selectedTemplate.id,
          ordered: false,
          slides: selectedTemplate.layouts.map((layoutItem) => ({
            id: layoutItem.layoutId,
            name: layoutItem.layoutName,
            description: layoutItem.layoutDescription,
            templateID: selectedTemplate.id,
            templateName: selectedTemplate.name,
            json_schema: layoutItem.schemaJSON,
          }))
        };
      }

      const response = await PresentationGenerationApi.presentationPrepare({
        presentation_id: presentationId,
        outlines: outlines,
        layout: layout,
      });

      if (response) {
        dispatch(clearPresentationData());
        clearTheme();
        router.replace(`/presentation?id=${presentationId}&stream=true&type=standard`);
      }
    } catch (error: any) {
      console.error('Error In Presentation Generation(prepare).', error);
      toast.error(t(language, "generationErrorTitle"), {
        description: error.message || "Error In Presentation Generation(prepare).",
      });
    } finally {
      setLoadingState(DEFAULT_LOADING_STATE);
    }
  }, [validateInputs, presentationId, outlines, dispatch, router, selectedTemplate]);

  return { loadingState, handleSubmit };
}; 