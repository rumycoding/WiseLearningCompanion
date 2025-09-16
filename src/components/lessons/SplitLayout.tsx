import { ReactNode } from 'react';

interface SplitLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  className?: string;
}

export const SplitLayout = ({ leftPanel, rightPanel, className = '' }: SplitLayoutProps) => {
  return (
    <div className={`split-layout flex h-full w-full ${className}`}>
      {/* Left Panel - Lesson Content (60%) */}
      <div className="flex-none w-3/5 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar">
          {leftPanel}
        </div>
      </div>
      
      {/* Right Panel - Chat (40%) */}
      <div className="flex-none w-2/5 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar">
          {rightPanel}
        </div>
      </div>
    </div>
  );
};