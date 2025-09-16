import { useState, useMemo } from 'react';
import { Lesson } from '../types/lesson';
import { searchLessons } from '../utils/lessonUtils';

export const useLessonSearch = (lessons: Lesson[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredLessons = useMemo(() => {
    let filtered = lessons;

    // Apply search query filter
    if (searchQuery.trim()) {
      filtered = searchLessons(filtered, searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(lesson => lesson.difficulty === selectedDifficulty);
    }

    return filtered;
  }, [lessons, searchQuery, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const suggestions = new Set<string>();
    
    lessons.forEach(lesson => {
      // Add matching tags
      lesson.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(tag);
        }
      });
      
      // Add matching title words
      const titleWords = lesson.title.split(/\s+/);
      titleWords.forEach(word => {
        if (word.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(word);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [lessons, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredLessons,
    clearFilters,
    searchSuggestions,
    hasActiveFilters: searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all'
  };
};