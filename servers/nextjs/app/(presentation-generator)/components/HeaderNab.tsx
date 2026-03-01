"use client";
import { Settings } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent, MixpanelEvent } from "../../../utils/mixpanel";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { t } from "../i18n";

const HeaderNav = () => {

  const canChangeKeys = useSelector((state: RootState) => state.userConfig.can_change_keys);
  const language = useSelector((state: RootState) => state.pptGenUpload.config?.language);
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {canChangeKeys && (
        <Link
          href="/settings"
          prefetch={false}
          className="flex items-center gap-2 px-3 py-2 text-white hover:bg-primary/80 rounded-md transition-colors outline-none"
          role="menuitem"
          onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/settings" })}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium font-inter">
            {t(language, "settings")}
          </span>
        </Link>
      )}
    </div>
  );
};

export default HeaderNav;
