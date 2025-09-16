import { Lesson } from '../../types/lesson';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../../context/LanguageContext';

interface LessonContentProps {
  lesson: Lesson | null;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const LessonContent = ({
  lesson,
  onNavigatePrevious,
  onNavigateNext,
  hasNext,
  hasPrevious
}: LessonContentProps) => {
  const { t } = useLanguage();

  const getDifficultyTranslation = (difficulty: string) => {
    return t(`lesson.${difficulty}`);
  };
  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">{t('lesson.selectStart')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigatePrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('lesson.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateNext}
            disabled={!hasNext}
            className="flex items-center gap-1"
          >
            {t('lesson.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t(lesson.category)}
        </div>
      </div>

      {/* Lesson content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-none prose dark:prose-invert">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          
          <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200 chinese-content chinese-character">
            {lesson.content}
          </div>
          
          {/* Lesson metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('lesson.tags')}</span>
              {lesson.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span>{t('lesson.difficulty')} </span>
              <span className={`
                px-2 py-1 rounded-full text-xs
                ${lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }
              `}>
                {getDifficultyTranslation(lesson.difficulty)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};