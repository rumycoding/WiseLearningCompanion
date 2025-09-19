import { useState, useRef, useEffect } from 'react';
import { ChatInput } from '../custom/chatinput';
import { PreviewMessage, ThinkingMessage } from '../custom/message';
import { useScrollToBottom } from '../custom/use-scroll-to-bottom';
import { message } from '../../interfaces/interfaces';
import { Lesson } from '../../types/lesson';
import { v4 as uuidv4 } from 'uuid';
import { MessageCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LessonChatProps {
  currentLesson: Lesson | null;
}

export const LessonChat = ({ currentLesson }: LessonChatProps) => {
  const { t, language } = useLanguage();
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const ws = new WebSocket(`${proto}://${host}:8090/ws`);
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, []);

  const cleanupMessageHandler = () => {
    if (messageHandlerRef.current && socket) {
      socket.removeEventListener("message", messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
  };

  async function handleSubmit(text?: string) {
    if (!socket || socket.readyState !== WebSocket.OPEN || isLoading) return;

    const messageText = text || question;
    
    // Add lesson context if available
    const contextualMessage = currentLesson
      ? `[${language === 'en' ? 'Lesson' : '课程'}: ${currentLesson.title}] ${messageText}`
      : messageText;

    setIsLoading(true);
    cleanupMessageHandler();
    
    const traceId = uuidv4();
    setMessages(prev => [...prev, { content: messageText, role: "user", id: traceId }]);
    socket.send(contextualMessage);
    setQuestion("");

    try {
      const messageHandler = (event: MessageEvent) => {
        setIsLoading(false);
        if(event.data.includes("[END]")) {
          return;
        }
        
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const newContent = lastMessage?.role === "assistant" 
            ? lastMessage.content + event.data 
            : event.data;
          
          const newMessage = { content: newContent, role: "assistant", id: traceId };
          return lastMessage?.role === "assistant"
            ? [...prev.slice(0, -1), newMessage]
            : [...prev, newMessage];
        });

        if (event.data.includes("[END]")) {
          cleanupMessageHandler();
        }
      };

      messageHandlerRef.current = messageHandler;
      socket.addEventListener("message", messageHandler);
    } catch (error) {
      console.error("WebSocket error:", error);
      setIsLoading(false);
    }
  }

  // Lesson-specific suggested questions
  const lessonSuggestions = currentLesson ? [
    {
      title: t('lesson.explainContent'),
      label: '',
      action: `${t('lesson.explainAction')} "${currentLesson.title}"`
    },
    {
      title: t('lesson.practiceProun'),
      label: '',
      action: `${t('lesson.pronounceAction')} "${currentLesson.title}"`
    },
    {
      title: t('lesson.relatedVocab'),
      label: '',
      action: `${t('lesson.vocabAction')} "${currentLesson.title}"`
    },
    {
      title: t('lesson.culturalBg'),
      label: '',
      action: `${t('lesson.cultureAction')} "${currentLesson.title}"`
    }
  ] : [];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <MessageCircle className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium text-gray-900 dark:text-white">{t('lesson.assistant')}</h3>
        {currentLesson && (
          <div className="flex items-center gap-1 ml-auto text-sm text-gray-500 dark:text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span className="truncate max-w-32">{currentLesson.title}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll p-4" ref={messagesContainerRef}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {currentLesson ? `${t('lesson.studying')}${currentLesson.title}` : t('lesson.selectLesson')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t('lesson.askAnything')}
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} />
        ))}
        {isLoading && <ThinkingMessage />}
        <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]"/>
      </div>

      {/* Quick Actions for Current Lesson */}
      {currentLesson && messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="grid grid-cols-1 gap-2">
            {lessonSuggestions.slice(0, 2).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(suggestion.action)}
                className="text-left p-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={isLoading}
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {suggestion.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ChatInput  
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};