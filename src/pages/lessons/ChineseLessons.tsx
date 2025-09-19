import { SplitLayout } from '../../components/lessons/SplitLayout';
import { LessonViewer } from './LessonViewer';
import { LessonChat } from '../../components/lessons/LessonChat';
import { Header } from '../../components/custom/header';
import { useLanguage } from '../../context/LanguageContext';
import { LessonProvider, useLessonContext } from '../../context/LessonContext';

const ChineseLessonsContent = () => {
  const { currentLesson, loading, error } = useLessonContext();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {t('loading.lessons')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xl font-medium mb-2">{t('error.loadFailed')}</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('error.reload')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-1 overflow-hidden">
        <SplitLayout
          leftPanel={<LessonViewer />}
          rightPanel={<LessonChat currentLesson={currentLesson} />}
        />
      </div>
    </div>
  );
};

export const ChineseLessons = () => {
  return (
    <LessonProvider>
      <ChineseLessonsContent />
    </LessonProvider>
  );
};