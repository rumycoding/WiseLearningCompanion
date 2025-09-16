import { Lesson } from '../../types/lesson';
import { useLanguage } from '../../context/LanguageContext';

interface LessonCardProps {
  lesson: Lesson;
  isSelected: boolean;
  onClick: (lessonId: string) => void;
}

export const LessonCard = ({ lesson, isSelected, onClick }: LessonCardProps) => {
  const { t } = useLanguage();
  return (
    <div
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      onClick={() => onClick(lesson.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {lesson.title}
        </h3>
        <span className={`
          px-2 py-1 text-xs rounded-full
          ${lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }
        `}>
          {t(`lesson.${lesson.difficulty}`)}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {lesson.content.substring(0, 100)}...
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {t(lesson.category)}
        </span>
        
        {lesson.tags.length > 0 && (
          <div className="flex gap-1">
            {lesson.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
              >
                {tag}
              </span>
            ))}
            {lesson.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{lesson.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};