import { useLessonSearch } from '../../hooks/useLessonSearch';
import { LessonCategory } from '../../types/lesson';
import { LessonTabs } from './LessonTabs';
import { LessonSearch } from './LessonSearch';
import { LessonCard } from './LessonCard';
import { useLanguage } from '../../context/LanguageContext';

interface LessonBrowserProps {
  categories: LessonCategory[];
  currentLessonId: string | null;
  onLessonSelect: (lessonId: string) => void;
}

export const LessonBrowser = ({
  categories,
  currentLessonId,
  onLessonSelect
}: LessonBrowserProps) => {
  const { t } = useLanguage();
  // Flatten all lessons from categories
  const allLessons = categories.flatMap(cat => cat.lessons);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredLessons,
    clearFilters,
    searchSuggestions,
    hasActiveFilters
  } = useLessonSearch(allLessons);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Filter lessons by selected category if not 'all'
  const displayLessons = selectedCategory === 'all'
    ? filteredLessons
    : filteredLessons.filter(lesson => lesson.category === getCategoryNameById(selectedCategory, categories));

  function getCategoryNameById(categoryId: string, categories: LessonCategory[]): string {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('lesson.title')}
        </h2>
        
        {/* Search */}
        <LessonSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          suggestions={searchSuggestions}
          onSuggestionClick={handleSuggestionClick}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
        
        {/* Category Tabs */}
        <LessonTabs
          categories={categories}
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto p-4">
        {displayLessons.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {hasActiveFilters ? (
              <div>
                <p className="mb-2">{t('lesson.noResults')}</p>
                <button
                  onClick={clearFilters}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  {t('lesson.clearFilters')}
                </button>
              </div>
            ) : (
              <p>{t('lesson.noLessons')}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isSelected={lesson.id === currentLessonId}
                onClick={onLessonSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};