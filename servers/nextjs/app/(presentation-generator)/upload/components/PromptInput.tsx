import { Textarea } from "../../../../components/ui/textarea";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { t } from "../../i18n";


interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;

}

export function PromptInput({
  value,
  onChange,

}: PromptInputProps) {
  const [showHint, setShowHint] = useState(false);
  const language = useSelector((state: RootState) => state.pptGenUpload.config?.language);
  const handleChange = (value: string) => {
    setShowHint(value.length > 0);
    onChange(value);
  };
  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={value}
          rows={5}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t(language, "promptPlaceholder")}
          data-testid="prompt-input"
          className="py-4 px-5 border-2 font-medium font-instrument_sans text-base min-h-[150px] max-h-[300px] border-border focus-visible:ring-offset-0 focus-visible:ring-ring overflow-y-auto custom_scrollbar"
        />
      </div>
      <p
        className={`text-sm text-gray-500 font-inter font-medium ${showHint ? "opacity-100" : "opacity-0"
          }`}
      >
        {t(language, "promptHint")}
      </p>
    </div>
  );
}
