import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Volume2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface WordPopupProps {
  word: string;
  pinyin: string;
  position: { x: number; y: number };
  onClose: () => void;
  isVisible: boolean;
}

// Simple word dictionary - in a real app, this would come from an API or database
const wordDictionary: { [key: string]: { en: string; zh: string } } = {
  '天': { en: 'sky, heaven', zh: '天空，天堂' },
  '地': { en: 'earth, ground', zh: '地球，土地' },
  '人': { en: 'person, human', zh: '人，人类' },
  '金': { en: 'gold, metal', zh: '金子，金属' },
  '木': { en: 'wood, tree', zh: '木头，树木' },
  '水': { en: 'water', zh: '水' },
  '火': { en: 'fire', zh: '火' },
  '土': { en: 'earth, soil', zh: '土壤，泥土' },
  '口': { en: 'mouth', zh: '嘴巴' },
  '耳': { en: 'ear', zh: '耳朵' },
  '目': { en: 'eye', zh: '眼睛' },
  '手': { en: 'hand', zh: '手' },
  '足': { en: 'foot', zh: '脚' },
  '日': { en: 'sun, day', zh: '太阳，日子' },
  '月': { en: 'moon, month', zh: '月亮，月份' },
  '山': { en: 'mountain', zh: '山' },
  '川': { en: 'river, stream', zh: '河流' },
  '风': { en: 'wind', zh: '风' },
  '雨': { en: 'rain', zh: '雨' },
  '雷': { en: 'thunder', zh: '雷' },
  '电': { en: 'electricity, lightning', zh: '电，闪电' },
  '春': { en: 'spring', zh: '春天' },
  '夏': { en: 'summer', zh: '夏天' },
  '秋': { en: 'autumn', zh: '秋天' },
  '冬': { en: 'winter', zh: '冬天' },
  '上': { en: 'up, above', zh: '上面' },
  '下': { en: 'down, below', zh: '下面' },
  '左': { en: 'left', zh: '左边' },
  '右': { en: 'right', zh: '右边' },
  '中': { en: 'middle, center', zh: '中间' },
  '大': { en: 'big, large', zh: '大的' },
  '小': { en: 'small, little', zh: '小的' },
  '多': { en: 'many, much', zh: '很多' },
  '少': { en: 'few, little', zh: '很少' },
  '长': { en: 'long', zh: '长的' },
  '短': { en: 'short', zh: '短的' },
  '高': { en: 'tall, high', zh: '高的' },
  '低': { en: 'low, short', zh: '低的' },
};

export const WordPopup: React.FC<WordPopupProps> = ({
  word,
  pinyin,
  position,
  onClose,
  isVisible
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  // Close popup on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.getElementById('word-popup');
      if (popup && !popup.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  const playPronunciation = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      // Use Web Speech API for pronunciation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      } else {
        // Fallback: just reset the playing state
        setTimeout(() => setIsPlaying(false), 1000);
      }
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
    }
  };

  const getDefinition = (word: string) => {
    const definition = wordDictionary[word];
    if (!definition) {
      return language === 'zh' ? '暂无释义' : 'No definition available';
    }
    return language === 'zh' ? definition.zh : definition.en;
  };

  if (!isVisible) return null;

  // Calculate popup position to keep it within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 280),
    y: Math.max(position.y - 120, 10)
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" />
      
      {/* Popup */}
      <div
        id="word-popup"
        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4 min-w-[250px] max-w-[300px]"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {word}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={playPronunciation}
              disabled={isPlaying}
              className="p-1 h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title={language === 'zh' ? '播放发音' : 'Play pronunciation'}
            >
              <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Pinyin */}
        <div className="mb-3">
          <span className="text-lg text-blue-600 dark:text-blue-400 font-mono">
            {pinyin}
          </span>
        </div>

        {/* Definition */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {language === 'zh' ? '释义：' : 'Definition:'}
          </p>
          <p className="text-base text-gray-900 dark:text-white leading-relaxed">
            {getDefinition(word)}
          </p>
        </div>

        {/* Tip */}
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh' ? '按 ESC 或点击外部关闭' : 'Press ESC or click outside to close'}
          </p>
        </div>
      </div>
    </>
  );
};