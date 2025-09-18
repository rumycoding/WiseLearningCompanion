import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Volume2, X, Play, Pause } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWordDefinition } from '../../hooks/useWordDefinition';

interface WordPopupProps {
  word: string;
  pinyin: string;
  position: { x: number; y: number };
  onClose: () => void;
  isVisible: boolean;
  difficulty?: string;
}

export const WordPopup: React.FC<WordPopupProps> = ({
  word,
  pinyin,
  position,
  onClose,
  isVisible,
  difficulty
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingDefinition, setPlayingDefinition] = useState(false);
  const [playingExample, setPlayingExample] = useState<number | null>(null);

  // Use React Query hook for word definition
  const {
    data: definitionResult,
    isLoading
  } = useWordDefinition(word, language, difficulty, isVisible);

  // Extract definition and examples from query result
  const definition = definitionResult?.data?.definition || 
    (language === 'zh' ? '暂无释义' : 'No definition available');
  const examples = definitionResult?.data?.examples || [];

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
    // If already playing, stop the speech
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }
    
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

  const playDefinition = async () => {
    // If already playing, stop the speech
    if (playingDefinition) {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setPlayingDefinition(false);
      return;
    }
    
    if (!definition) return;
    
    setPlayingDefinition(true);
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(definition);
        utterance.lang = language === 'zh' ? 'zh-CN' : 'en-US';
        utterance.rate = 0.8;
        
        utterance.onend = () => setPlayingDefinition(false);
        utterance.onerror = () => setPlayingDefinition(false);
        
        speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlayingDefinition(false), 1000);
      }
    } catch (error) {
      console.error('Error playing definition:', error);
      setPlayingDefinition(false);
    }
  };

  const playExample = async (example: string, index: number) => {
    // If this example is already playing, stop the speech
    if (playingExample === index) {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setPlayingExample(null);
      return;
    }
    
    if (!example) return;
    
    setPlayingExample(index);
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(example);
        utterance.lang = language === 'zh' ? 'zh-CN' : 'en-US';
        utterance.rate = 0.8;
        
        utterance.onend = () => setPlayingExample(null);
        utterance.onerror = () => setPlayingExample(null);
        
        speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlayingExample(null), 1000);
      }
    } catch (error) {
      console.error('Error playing example:', error);
      setPlayingExample(null);
    }
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
              className="p-1 h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title={language === 'zh' ? (isPlaying ? '停止发音' : '播放发音') : (isPlaying ? 'Stop pronunciation' : 'Play pronunciation')}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-blue-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
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
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '释义：' : 'Definition:'}
            </p>
            {!isLoading && definition && (
              <Button
                variant="ghost"
                size="sm"
                onClick={playDefinition}
                className="p-1 h-6 w-6 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title={language === 'zh' ? (playingDefinition ? '停止播放' : '播放释义') : (playingDefinition ? 'Stop definition' : 'Play definition')}
              >
                {playingDefinition ? (
                  <Pause className="h-3 w-3 text-blue-500" />
                ) : (
                  <Play className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                )}
              </Button>
            )}
          </div>
          <p className="text-base text-gray-900 dark:text-white leading-relaxed">
            {isLoading ? (
              <span className="text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </span>
            ) : (
              definition
            )}
          </p>
        </div>

        {/* Examples */}
        {!isLoading && examples.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {language === 'zh' ? '例句：' : 'Examples:'}
            </p>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                    • {example}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playExample(example, index)}
                    className="p-1 h-5 w-5 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0 mt-0.5"
                    title={language === 'zh' ? (playingExample === index ? '停止播放' : '播放例句') : (playingExample === index ? 'Stop example' : 'Play example')}
                  >
                    {playingExample === index ? (
                      <Pause className="h-2.5 w-2.5 text-blue-500" />
                    ) : (
                      <Play className="h-2.5 w-2.5 text-gray-500 dark:text-gray-400" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

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