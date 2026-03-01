import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { HelpCircle, X, Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { normalizeLanguage, t } from "../../i18n";

const HELP_Q_EN = [
  {
    id: 1,
    category: "Images",
    question: "How do I change an image?",
    answer:
      "Click on any image to open the side panel. It has tabs: AI Generate, Upload, and Edit. The Edit tab lets you adjust the focus point and how the image fits (cover, contain, fill).",
  },
  {
    id: 2,
    category: "Images",
    question: "Can I generate new images with AI?",
    answer:
      "Yes! Click on any image to open the side panel. Go to the AI Generate tab, enter your prompt, and the AI will generate an image based on your description.",
  },
  {
    id: 3,
    category: "Images",
    question: "How do I upload my own images?",
    answer:
      "Click on any image to open the side panel. Go to the Upload tab, select a file from your computer, and click on it to apply it to the slide.",
  },
  {
    id: 11,
    category: "AI Prompts",
    question: "Can I change slide layout through prompt?",
    answer:
      "Yes you can! Click on the WandSparkles icon on the top left of each slide and it will give you a prompt input box. Describe your layout requirements and the AI will change the slide layout accordingly.",
  },
  {
    id: 12,
    category: "AI Prompts",
    question: "Can I change slide image through prompt?",
    answer:
      "Yes you can! Click on the WandSparkles icon on the top left of each slide and it will give you a prompt input box. Describe the image you want and the AI will update the slide image based on your requirements.",
  },

  {
    id: 14,
    category: "AI Prompts",
    question: "Can I change content through prompt?",
    answer:
      "Yes you can! Click on the WandSparkles icon on the top left of each slide and it will give you a prompt input box. Describe what content you want and the AI will update the slide's text and content based on your description.",
  },
  {
    id: 4,
    category: "Text",
    question: "How can I format and highlight text?",
    answer:
      "Select any text to see the formatting toolbar. You'll have options for Bold, Italic, Underline, Strikethrough, and Code.",
  },
  {
    id: 5,
    category: "Icons",
    question: "How do I change icons?",
    answer:
      "Click on any existing icon to modify it. In the icon selector panel, you can browse or search for icons. We offer thousands of icons in various styles.",
  },
  {
    id: 16,
    category: "Layout",
    question: "Can I reorder slides?",
    answer:
      "Yes! In the side panel you can drag slides to reorder them.",
  },
  {
    id: 15,
    category: "Layout",
    question: "Can I add a new slide between slides?",
    answer:
      "Yes! Click the plus icon below any slide to add a new one. Choose the layout you need from the list.",
  },
  {
    id: 8,
    category: "Export",
    question: "How do I download or export my presentation?",
    answer:
      "Click the Export button in the top right menu. You can choose to download as PDF, PowerPoint.",
  },
];

const HELP_Q_RU = [
  {
    id: 1,
    category: "Изображения",
    question: "Как заменить изображение?",
    answer:
      "Нажмите на изображение — откроется боковая панель с вкладками: AI Generate, Upload, Edit. Во вкладке Edit можно настроить точку фокуса и способ вписывания (cover, contain, fill).",
  },
  {
    id: 2,
    category: "Изображения",
    question: "Можно ли сгенерировать новое изображение с помощью AI?",
    answer:
      "Да. Нажмите на изображение, откройте вкладку «AI Generate» в боковой панели, введите промпт — изображение будет сгенерировано по описанию.",
  },
  {
    id: 3,
    category: "Изображения",
    question: "Как загрузить своё изображение?",
    answer:
      "Нажмите на изображение, откройте вкладку «Upload» в боковой панели, выберите файл и нажмите на него, чтобы применить к слайду.",
  },
  {
    id: 11,
    category: "AI-промпты",
    question: "Можно ли поменять layout слайда через промпт?",
    answer:
      "Да. Нажмите на иконку WandSparkles в левом верхнем углу слайда — появится поле для промпта. Опишите требования к layout, и AI перестроит слайд.",
  },
  {
    id: 12,
    category: "AI-промпты",
    question: "Можно ли поменять изображение на слайде через промпт?",
    answer:
      "Да. Откройте промпт через WandSparkles на слайде и опишите нужное изображение — AI обновит картинку по требованиям.",
  },
  {
    id: 14,
    category: "AI-промпты",
    question: "Можно ли поменять текст/контент через промпт?",
    answer:
      "Да. Через WandSparkles опишите, какой контент нужен — AI обновит текст и содержимое слайда.",
  },
  {
    id: 4,
    category: "Текст",
    question: "Как форматировать и выделять текст?",
    answer:
      "Выделите текст — появится панель форматирования (жирный, курсив, подчёркивание, зачёркивание и т.д.).",
  },
  {
    id: 5,
    category: "Иконки",
    question: "Как заменить иконки?",
    answer:
      "Нажмите на иконку — откроется панель выбора. Можно искать иконки по запросу и выбирать стиль.",
  },
  {
    id: 16,
    category: "Layout",
    question: "Можно ли менять порядок слайдов?",
    answer:
      "Да. В боковой панели перетащите слайд мышкой в нужное место.",
  },
  {
    id: 15,
    category: "Layout",
    question: "Можно ли добавить новый слайд между слайдами?",
    answer:
      "Да. Нажмите на плюс под слайдом — появится список layouts, выберите нужный.",
  },
  {
    id: 8,
    category: "Экспорт",
    question: "Как скачать/экспортировать презентацию?",
    answer:
      "Нажмите «Экспорт» в правом верхнем углу. Можно скачать в PDF или PowerPoint (PPTX).",
  },
];

const Help = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const language = useSelector((state: RootState) => state.pptGenUpload.config?.language);
  const isEn = normalizeLanguage(language) === "en";
  const questions = isEn ? HELP_Q_EN : HELP_Q_RU;
  const allLabel = t(language, "all");

  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(allLabel);
  const modalRef = useRef<HTMLDivElement>(null);

  // Extract unique categories and create "All" category list
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(questions.map((q) => q.category))
    );
    setCategories([allLabel, ...uniqueCategories]);
    setSelectedCategory(allLabel);
    setSearchQuery("");
    setFilteredQuestions(questions);
  }, [allLabel, isEn]);

  // Filter questions based on search query and selected category
  useEffect(() => {
    let results = questions;

    // Filter by category if not "All"
    if (selectedCategory !== allLabel) {
      results = results.filter((q) => q.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      );
    }

    setFilteredQuestions(results);
  }, [searchQuery, selectedCategory, allLabel, questions]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".help-button")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  // Animation helpers
  const modalClass = isOpen
    ? "opacity-100 scale-100"
    : "opacity-0 scale-95 pointer-events-none";

  return (
    <>
      {/* Help Button */}
      <button
        onClick={handleOpenClose}
        className="help-button fixed bottom-6 right-6 h-12 w-12 z-50 bg-emerald-600 hover:bg-emerald-700 rounded-full flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
        aria-label={t(language, "helpCenter")}
      >
        {isOpen ? (
          <X className="text-white h-5 w-5" />
        ) : (
          <HelpCircle className="text-white h-5 w-5" />
        )}
      </button>

      {/* Help Modal */}
      <div
        className={`fixed bottom-20 right-6 z-50 max-w-md w-full transition-all duration-300 transform ${modalClass}`}
        ref={modalRef}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">{t(language, "helpCenter")}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-emerald-700 p-1 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder={t(language, "searchHelpTopics")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Category Pills */}
          <div className="px-6 pb-3 flex gap-2 overflow-x-auto hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="max-h-96 overflow-y-auto px-6 pb-6">
            {filteredQuestions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredQuestions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <AccordionTrigger className="hover:no-underline py-3 px-1 text-left flex">
                      <div className="flex-1 pr-2">
                        <span className="text-gray-900 font-medium text-sm md:text-base">
                          {faq.question}
                        </span>
                        <span className="block text-xs text-emerald-600 mt-0.5">
                          {faq.category}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-3">
                      <div className="text-sm text-gray-600 leading-relaxed rounded bg-gray-50 p-3">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>{t(language, "noResultsFoundFor", { query: searchQuery })}</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(allLabel);
                  }}
                  className="mt-2 text-emerald-600 hover:underline text-sm"
                >
                  {t(language, "clearSearch")}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">
            {t(language, "stillNeedHelp")}{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">
              {t(language, "contactSupport")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
