'use client'
import React from "react";
import PresentationPage from "./components/PresentationPage";
import { Button } from "../../../components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { t } from "../i18n";
const page = () => {

  const router = useRouter();
  const params = useSearchParams();
  const language = useSelector((state: RootState) => state.pptGenUpload.config?.language);
  const queryId = params.get("id");
  if (!queryId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">{t(language, "noPresentationIdTitle")}</h1>
        <p className="text-gray-500 pb-4">{t(language, "pleaseTryAgain")}</p>
        <Button onClick={() => router.push("/upload")}>{t(language, "goHome")}</Button>
      </div>
    );
  }
  return (

    <PresentationPage presentation_id={queryId} />

  );
};
export default page;
