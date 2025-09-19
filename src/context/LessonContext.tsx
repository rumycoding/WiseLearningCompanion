import { createContext, useContext, ReactNode } from 'react';
import { useLessons } from '../hooks/useLessons';
import { Lesson, LessonCategory } from '../types/lesson';

interface LessonContextType {
  lessons: Lesson[];
  categories: LessonCategory[];
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
  selectLesson: (lessonId: string) => void;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  getNextLesson: () => Lesson | null;
  getPreviousLesson: () => Lesson | null;
  reloadLessons: () => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

interface LessonProviderProps {
  children: ReactNode;
}

export const LessonProvider = ({ children }: LessonProviderProps) => {
  const lessonData = useLessons();

  return (
    <LessonContext.Provider value={lessonData}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLessonContext must be used within a LessonProvider');
  }
  return context;
};