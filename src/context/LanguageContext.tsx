import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.chat': 'Chat',
    'nav.lessons': 'Lessons',
    
    // Loading states
    'loading.lessons': 'Loading Chinese lessons...',
    'loading.general': 'Loading...',
    
    // Error states
    'error.loadFailed': 'Load Failed',
    'error.reload': 'Reload',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    
    // Lesson interface
    'lesson.search': 'Search lessons...',
    'lesson.all': 'All',
    'lesson.beginner': 'Beginner',
    'lesson.intermediate': 'Intermediate',
    'lesson.advanced': 'Advanced',
    'lesson.noResults': 'No lessons found',
    'lesson.tryDifferent': 'Try different search terms or browse by category',
    'lesson.askQuestion': 'Ask a question about this lesson...',
    'lesson.send': 'Send',
    'lesson.suggestions': 'Suggestions',
    'lesson.title': 'Chinese Lessons',
    'lesson.noLessons': 'No lessons available',
    'lesson.clearFilters': 'Clear filters',
    'lesson.assistant': 'Learning Assistant',
    'lesson.studying': 'Currently studying: ',
    'lesson.selectLesson': 'Select a lesson to start chatting',
    'lesson.askAnything': 'Ask me anything about Chinese learning',
    'lesson.explainContent': 'Explain content',
    'lesson.practiceProun': 'Practice pronunciation',
    'lesson.relatedVocab': 'Related vocabulary',
    'lesson.culturalBg': 'Cultural background',
    'lesson.explainAction': 'Please explain the content and meaning of this lesson',
    'lesson.pronounceAction': 'Please help me practice the pronunciation of Chinese characters in this lesson',
    'lesson.vocabAction': 'Please introduce vocabulary and expressions related to this lesson',
    'lesson.cultureAction': 'Please introduce the cultural background and history of this lesson',
    'chat.placeholder': 'Send a message...',
    'chat.waitMessage': 'Please wait for the model to finish its response!',
    'chat.learnChinese': 'Learn Chinese',
    'chat.basicKnowledge': 'Basic knowledge',
    'chat.characterPractice': 'Character practice',
    'chat.pronunciation': 'Pronunciation guide',
    'chat.learnAction': 'Please teach me some basic Chinese knowledge',
    'chat.practiceAction': 'Please help me practice Chinese character pronunciation',
    'lesson.previous': 'Previous',
    'lesson.next': 'Next',
    'lesson.selectStart': 'Select a lesson to start learning',
    'lesson.tags': 'Tags:',
    'lesson.difficulty': 'Difficulty:',
    'lesson.loadingLessons': 'Loading lessons...',
    'lesson.loadingFailed': 'Failed to load lessons',
    // Category translations
    '基础汉字': 'Basic Characters',
    '三字经': 'Three Character Classic',
    '人体部位': 'Body Parts',
    '自然元素': 'Natural Elements',
  },
  zh: {
    // Navigation
    'nav.chat': '聊天',
    'nav.lessons': '课程',
    
    // Loading states
    'loading.lessons': '正在加载中文课程...',
    'loading.general': '加载中...',
    
    // Error states
    'error.loadFailed': '加载失败',
    'error.reload': '重新加载',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    
    // Lesson interface
    'lesson.search': '搜索课程...',
    'lesson.all': '全部',
    'lesson.beginner': '初级',
    'lesson.intermediate': '中级',
    'lesson.advanced': '高级',
    'lesson.noResults': '未找到课程',
    'lesson.tryDifferent': '尝试不同的搜索词或按类别浏览',
    'lesson.askQuestion': '询问关于此课程的问题...',
    'lesson.send': '发送',
    'lesson.suggestions': '建议',
    'lesson.title': '中文课程',
    'lesson.noLessons': '暂无课程',
    'lesson.clearFilters': '清除筛选条件',
    'lesson.assistant': '学习助手',
    'lesson.studying': '正在学习: ',
    'lesson.selectLesson': '选择一个课程开始对话',
    'lesson.askAnything': '问我任何关于中文学习的问题',
    'lesson.explainContent': '解释这个课程',
    'lesson.practiceProun': '练习发音',
    'lesson.relatedVocab': '相关词汇',
    'lesson.culturalBg': '文化背景',
    'lesson.explainAction': '请解释这个课程的内容和含义',
    'lesson.pronounceAction': '请帮我练习这个课程中的汉字发音',
    'lesson.vocabAction': '请介绍与这个课程相关的词汇和表达',
    'lesson.cultureAction': '请介绍这个课程的文化背景和历史',
    'chat.placeholder': '发送消息...',
    'chat.waitMessage': '请等待模型完成回复！',
    'chat.learnChinese': '学习中文',
    'chat.basicKnowledge': '基础知识',
    'chat.characterPractice': '汉字练习',
    'chat.pronunciation': '发音指导',
    'chat.learnAction': '请教我一些中文基础知识',
    'chat.practiceAction': '请帮我练习汉字发音',
    'lesson.previous': '上一课',
    'lesson.next': '下一课',
    'lesson.selectStart': '请选择一个课程开始学习',
    'lesson.tags': '标签:',
    'lesson.difficulty': '难度:',
    'lesson.loadingLessons': '加载课程中...',
    'lesson.loadingFailed': '加载课程失败',
    // Category translations (keep Chinese as is)
    '基础汉字': '基础汉字',
    '三字经': '三字经',
    '人体部位': '人体部位',
    '自然元素': '自然元素',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'zh'; // Default to Chinese
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}