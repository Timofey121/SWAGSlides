"use client";

import React, { useMemo, useRef } from "react";
import EditableLayoutWrapper from "./EditableLayoutWrapper";
import SlideErrorBoundary from "./SlideErrorBoundary";
import TiptapTextReplacer from "./TiptapTextReplacer";
import { validate as uuidValidate } from 'uuid';
import { getLayoutByLayoutId } from "../../presentation-templates";
import { useCustomTemplateDetails } from "../../hooks/useCustomTemplates";
import { updateSlideContent } from "../../../store/slices/presentationGeneration";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";




export const V1ContentRender = ({ slide, isEditMode, theme }: { slide: any, isEditMode: boolean, theme?: any, enableEditMode?: boolean }) => {
    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement | null>(null);

    if (!slide) {
        return (
            <div className="flex flex-col items-center justify-center aspect-video h-full bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-center text-sm">Invalid slide</p>
            </div>
        );
    }

    const content = slide.content ?? {};
    const layoutGroup = slide.layout_group ?? "default";
    const customTemplateId = layoutGroup.startsWith("custom-") ? layoutGroup.split("custom-")[1] : layoutGroup;
    const isCustomTemplate = uuidValidate(customTemplateId) || layoutGroup.startsWith("custom-");

    // Always call the hook (React hooks rule), but with empty id when not a custom template
    const { template: customTemplate, loading: customLoading, fonts } = useCustomTemplateDetails({
        id: isCustomTemplate ? customTemplateId : "",
        name: isCustomTemplate ? slide.layout_group : "",
        description: ""
    });
    if (fonts && typeof fonts === 'object') {
        // useFontLoader(fonts as unknown as Record<string, string>);
    }

    // Memoize layout resolution to prevent unnecessary recalculations
    const layoutStr = slide.layout ?? "default:default";
    const Layout = useMemo(() => {
        if (isCustomTemplate) {
            if (customTemplate) {
                const layoutId = layoutStr.startsWith("custom-") ? layoutStr.split(":")[1] : layoutStr;


                const compiledLayout = customTemplate.layouts.find(
                    (layout) => layout.layoutId === layoutId
                );


                return compiledLayout?.component ?? null;
            }
            return null;
        } else {
            const template = getLayoutByLayoutId(layoutStr);
            return template?.component ?? null;
        }
    }, [isCustomTemplate, customTemplate, layoutStr, layoutGroup]);

    // Show loading state for custom templates
    if (isCustomTemplate && customLoading) {
        return (
            <div className="flex flex-col items-center justify-center aspect-video h-full bg-gray-100 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        );
    }


    if (!Layout) {
        if (!content || Object.keys(content).length === 0) {
            return (
                <div className="flex flex-col items-center cursor-pointer justify-center aspect-video h-full bg-gray-100 rounded-lg">
                    <p className="text-gray-600 text-center text-base">Blank Slide</p>
                    <p className="text-gray-600 text-center text-sm">This slide is empty. Please add content to it using the edit button.</p>
                </div>
            )
        }
        return (
            <div className="flex flex-col items-center justify-center aspect-video h-full bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-center text-base">
                    Layout &quot;{layoutStr}&quot; not found in &quot;
                    {layoutGroup}&quot; Template
                </p>
            </div>
        );
    }
    const LayoutComp = Layout as React.ComponentType<{ data: any }>;

    if (isEditMode) {
        return (
            <SlideErrorBoundary label={`Slide ${slide.index + 1}`}>
                <div ref={containerRef} className={`w-full h-full `}>

                    <EditableLayoutWrapper
                        slideIndex={slide.index}
                        slideData={content}
                        properties={slide.properties}
                    >
                        <TiptapTextReplacer
                            key={slide.id ?? slide.index}
                            slideData={content}
                            slideIndex={slide.index}
                            onContentChange={(
                                content: string,
                                dataPath: string,
                                slideIndex?: number
                            ) => {
                                if (dataPath && slideIndex !== undefined) {
                                    dispatch(
                                        updateSlideContent({
                                            slideIndex: slideIndex,
                                            dataPath: dataPath,
                                            content: content,
                                        })
                                    );
                                }
                            }}
                        >
                            <LayoutComp data={{
                                ...content,
                                _logo_url__: theme ? theme.logo_url : null,
                                __companyName__: (theme && theme.company_name) ? theme.company_name : null,
                            }} />
                        </TiptapTextReplacer>
                    </EditableLayoutWrapper>



                </div>
            </SlideErrorBoundary>

        );
    }
    return (
        <LayoutComp data={{
            ...content,
            _logo_url__: theme ? theme.logo_url : null,
            __companyName__: (theme && theme.company_name) ? theme.company_name : null,
        }} />
    )
};

