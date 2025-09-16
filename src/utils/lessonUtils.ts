import { Lesson, LessonCategory } from '../types/lesson';

export const lessonFiles = [
  'lesson1.md',
  'lesson2.md',
  'lesson3.md'
];

export const parseMarkdownContent = (content: string): { title: string; body: string } => {
  const lines = content.split('\n');
  const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') || 'Untitled';
  const body = lines.filter(line => !line.startsWith('# ')).join('\n').trim();
  return { title, body };
};

export const categorizeLessons = (lessons: Lesson[]): LessonCategory[] => {
  const categories: { [key: string]: LessonCategory } = {};
  
  lessons.forEach(lesson => {
    if (!categories[lesson.category]) {
      categories[lesson.category] = {
        id: lesson.category.toLowerCase().replace(/\s+/g, '-'),
        name: lesson.category,
        description: getCategoryDescription(lesson.category),
        lessons: []
      };
    }
    categories[lesson.category].lessons.push(lesson);
  });
  
  return Object.values(categories);
};

export const getCategoryDescription = (category: string): string => {
  const descriptions: { [key: string]: string } = {
    '基础汉字': 'Learn fundamental Chinese characters and their meanings',
    '三字经': 'Traditional Chinese text for children learning',
    '人体部位': 'Body parts and human anatomy in Chinese',
    '自然元素': 'Natural elements and phenomena'
  };
  
  return descriptions[category] || 'Chinese language learning content';
};

export const determineLessonCategory = (title: string, content: string): string => {
  // Simple categorization based on content
  if (title.includes('天地人') || content.includes('天地人')) {
    return '基础汉字';
  }
  if (title.includes('金木水火土') || content.includes('金木水火土')) {
    return '自然元素';
  }
  if (title.includes('口耳目手足') || content.includes('口耳目')) {
    return '人体部位';
  }
  
  return '三字经';
};

export const searchLessons = (lessons: Lesson[], query: string): Lesson[] => {
  if (!query.trim()) return lessons;
  
  const lowercaseQuery = query.toLowerCase();
  return lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(lowercaseQuery) ||
    lesson.content.toLowerCase().includes(lowercaseQuery) ||
    lesson.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const loadLessonContent = async (filename: string): Promise<string> => {
  try {
    const response = await fetch(`/lesson/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load lesson: ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading lesson:', error);
    return '';
  }
};