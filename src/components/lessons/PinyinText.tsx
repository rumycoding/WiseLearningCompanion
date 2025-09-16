import React, { useState } from 'react';
import { addPinyinToText } from '../../utils/pinyinUtils';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PinyinTextProps {
  text: string;
  className?: string;
}

export const PinyinText: React.FC<PinyinTextProps> = ({ text, className = '' }) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const { language } = useLanguage();
  
  const processedText = addPinyinToText(text);

  const getToggleText = () => {
    if (showPinyin) {
      return language === 'zh' ? '隐藏拼音' : 'Hide Pinyin';
    } else {
      return language === 'zh' ? '显示拼音' : 'Show Pinyin';
    }
  };

  return (
    <div className={`pinyin-container ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPinyin(!showPinyin)}
          className="flex items-center gap-1"
        >
          {showPinyin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {getToggleText()}
        </Button>
      </div>
      
      <div className="pinyin-text-container">
        {processedText.map((charInfo, index) => (
          <span key={index} className="pinyin-char-wrapper">
            {charInfo.isChinese ? (
              <span className="chinese-char-with-pinyin inline-block text-center mx-1">
                {showPinyin && charInfo.pinyin && (
                  <span className="pinyin-annotation block text-sm text-blue-600 dark:text-blue-400 leading-tight mb-1 font-mono">
                    {charInfo.pinyin}
                  </span>
                )}
                <span className="chinese-char text-lg font-medium">
                  {charInfo.char}
                </span>
              </span>
            ) : (
              <span className="non-chinese-char">
                {charInfo.char}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

interface PinyinContentProps {
  content: string;
  className?: string;
}

export const PinyinContent: React.FC<PinyinContentProps> = ({ content, className = '' }) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const { language } = useLanguage();
  
  const lines = content.split('\n');

  const getToggleText = () => {
    if (showPinyin) {
      return language === 'zh' ? '隐藏拼音' : 'Hide Pinyin';
    } else {
      return language === 'zh' ? '显示拼音' : 'Show Pinyin';
    }
  };

  return (
    <div className={`pinyin-content ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPinyin(!showPinyin)}
          className="flex items-center gap-1"
        >
          {showPinyin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {getToggleText()}
        </Button>
      </div>
      
      <div className="space-y-4">
        {lines.map((line, lineIndex) => {
          if (!line.trim()) {
            return <div key={lineIndex} className="h-4" />;
          }
          
          const processedLine = addPinyinToText(line);
          
          return (
            <div key={lineIndex} className="line-container flex flex-wrap items-start">
              {processedLine.map((charInfo, charIndex) => (
                <span key={charIndex} className="char-wrapper">
                  {charInfo.isChinese ? (
                    <span className="chinese-char-with-pinyin inline-block text-center mx-0.5">
                      {showPinyin && charInfo.pinyin && (
                        <span className="pinyin-annotation block text-base text-blue-600 dark:text-blue-400 leading-tight mb-1 font-mono min-h-[1.4rem]">
                          {charInfo.pinyin}
                        </span>
                      )}
                      <span className="chinese-char text-2xl font-medium block">
                        {charInfo.char}
                      </span>
                    </span>
                  ) : (
                    <span className="non-chinese-char text-2xl">
                      {showPinyin && (
                        <span className="block text-base leading-tight mb-1 min-h-[1.4rem]">
                          &nbsp;
                        </span>
                      )}
                      <span className="block">
                        {charInfo.char}
                      </span>
                    </span>
                  )}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};