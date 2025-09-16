import { LessonCategory } from '../../types/lesson';
import { useLanguage } from '../../context/LanguageContext';

interface LessonTabsProps {
  categories: LessonCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const LessonTabs = ({ categories, activeCategory, onCategoryChange }: LessonTabsProps) => {
  const { t } = useLanguage();
  const allTab = { id: 'all', name: t('lesson.all'), description: 'All lessons', lessons: [] };
  const allCategories = [allTab, ...categories];

  return (
    <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200 dark:border-gray-700">
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200
            ${activeCategory === category.id
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {t(category.name)}
          {category.lessons.length > 0 && (
            <span className={`
              ml-2 px-1.5 py-0.5 text-xs rounded-full
              ${activeCategory === category.id
                ? 'bg-blue-400 text-blue-100'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}>
              {category.lessons.length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};