import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, BookOpen } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.chat')}</span>
            </Link>
            
            <Link
              to="/lessons"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === "/lessons"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.lessons')}</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
    </>
  );
};