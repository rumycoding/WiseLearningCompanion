export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string;
  imagePath?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  filename: string;
}

export interface LessonCategory {
  id: string;
  name: string;
  description: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  lastAccessed: Date;
  timeSpent: number;
}