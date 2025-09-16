import { useState } from 'react';
import { useLessons } from '../../hooks/useLessons';
import { LessonBrowser } from '../../components/lessons/LessonBrowser';
import { LessonContent } from '../../components/lessons/LessonContent';
import { useLanguage } from '../../context/LanguageContext';

export const LessonViewer = () => {
  const { t } = useLanguage();
  const [isBrowserCollapsed, setIsBrowserCollapsed] = useState(false);
  const {
    categories,
    currentLesson,
    loading,
    error,
    selectLesson,
    navigateToNext,
    navigateToPrevious,
    getNextLesson,
    getPreviousLesson
  } = useLessons();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('lesson.loadingLessons')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500 dark:text-red-400">
          <p className="mb-2">{t('lesson.loadingFailed')}</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Lesson Browser */}
      <div className={`border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${
        isBrowserCollapsed ? 'w-12' : 'w-80'
      }`}>
        <LessonBrowser
          categories={categories}
          currentLessonId={currentLesson?.id || null}
          onLessonSelect={selectLesson}
          isCollapsed={isBrowserCollapsed}
          onToggleCollapse={() => setIsBrowserCollapsed(!isBrowserCollapsed)}
        />
      </div>

      {/* Main Content - Lesson Display */}
      <div className="flex-1 transition-all duration-300">
        <LessonContent
          lesson={currentLesson}
          onNavigatePrevious={navigateToPrevious}
          onNavigateNext={navigateToNext}
          hasNext={getNextLesson() !== null}
          hasPrevious={getPreviousLesson() !== null}
        />
      </div>
    </div>
  );
};