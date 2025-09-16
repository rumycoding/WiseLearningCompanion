import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useLanguage } from '../../context/LanguageContext';

interface LessonSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const LessonSearch = ({
  searchQuery,
  onSearchChange,
  suggestions,
  onSuggestionClick,
  hasActiveFilters,
  onClearFilters
}: LessonSearchProps) => {
  const { t } = useLanguage();
  return (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={t('lesson.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search Suggestions */}
      {searchQuery.trim() && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('lesson.suggestions')}:</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};