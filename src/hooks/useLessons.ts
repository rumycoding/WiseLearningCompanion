import { useState, useEffect } from 'react';
import { Lesson, LessonCategory } from '../types/lesson';
import {
  lessonFiles,
  parseMarkdownContent,
  categorizeLessons,
  determineLessonCategory,
  loadLessonContent,
  loadLessonMetadata
} from '../utils/lessonUtils';

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const loadedLessons: Lesson[] = [];

      for (const filename of lessonFiles) {
        const content = await loadLessonContent(filename);
        if (content) {
          const { title, body } = parseMarkdownContent(content);
          const category = await determineLessonCategory(filename);
          
          const lesson: Lesson = {
            id: filename.replace('.md', ''),
            title,
            category,
            content: body,
            difficulty: 'beginner', // Default for now
            tags: extractTags(title, body),
            filename
          };
          
          loadedLessons.push(lesson);
        }
      }

      setLessons(loadedLessons);
      setCategories(categorizeLessons(loadedLessons));
      
      // Set first lesson as current if none selected
      if (loadedLessons.length > 0 && !currentLesson) {
        setCurrentLesson(loadedLessons[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const extractTags = (title: string, content: string): string[] => {
    const tags: string[] = [];
    
    // Extract Chinese characters as tags
    const chineseChars = (title + content).match(/[\u4e00-\u9fff]/g);
    if (chineseChars) {
      // Get unique characters and limit to first 5
      const uniqueChars = [...new Set(chineseChars)].slice(0, 5);
      tags.push(...uniqueChars);
    }
    
    return tags;
  };

  const selectLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };

  const getNextLesson = (): Lesson | null => {
    if (!currentLesson) return null;
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = (): Lesson | null => {
    if (!currentLesson) return null;
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const navigateToNext = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  };

  const navigateToPrevious = () => {
    const previousLesson = getPreviousLesson();
    if (previousLesson) {
      setCurrentLesson(previousLesson);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  return {
    lessons,
    categories,
    currentLesson,
    loading,
    error,
    selectLesson,
    navigateToNext,
    navigateToPrevious,
    getNextLesson,
    getPreviousLesson,
    reloadLessons: loadLessons
  };
};