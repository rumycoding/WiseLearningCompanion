import pinyin from 'pinyin';

/**
 * Get pinyin for a Chinese character using the pinyin library
 */
export const getPinyin = (char: string): string => {
  try {
    const result = pinyin(char, {
      style: pinyin.STYLE_TONE, // Use tone marks (ā, á, ǎ, à)
      segment: false,
      heteronym: false
    });
    
    if (result && result.length > 0 && result[0].length > 0) {
      return result[0][0];
    }
    return '';
  } catch (error) {
    console.warn('Error getting pinyin for character:', char, error);
    return '';
  }
};

/**
 * Check if a character is Chinese
 */
export const isChineseChar = (char: string): boolean => {
  return /[\u4e00-\u9fff]/.test(char);
};

/**
 * Process text content to add pinyin annotations
 */
export const addPinyinToText = (text: string): Array<{
  char: string;
  pinyin?: string;
  isChinese: boolean;
}> => {
  return Array.from(text).map(char => ({
    char,
    pinyin: isChineseChar(char) ? getPinyin(char) : undefined,
    isChinese: isChineseChar(char)
  }));
};

/**
 * Process content with pinyin for display
 */
export const processContentWithPinyin = (content: string) => {
  const lines = content.split('\n');
  return lines.map(line => addPinyinToText(line));
};

/**
 * Get pinyin for entire text with different style options
 */
export const getTextPinyin = (text: string, options?: {
  style?: number;
  heteronym?: boolean;
  segment?: boolean;
}): string => {
  try {
    const result = pinyin(text, {
      style: options?.style || pinyin.STYLE_TONE,
      heteronym: options?.heteronym || false,
      segment: options?.segment || false
    });
    
    return result.map(item => item[0]).join(' ');
  } catch (error) {
    console.warn('Error getting pinyin for text:', text, error);
    return '';
  }
};