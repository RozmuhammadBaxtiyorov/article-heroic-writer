
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ArticleDisplayProps {
  title: string;
  content: string;
  isLoading: boolean;
  modelName?: string;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({
  title,
  content,
  isLoading,
  modelName,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = formatMarkdown(content);
    }
  }, [content]);
  
  const formatMarkdown = (text: string): string => {
    if (!text) return '';
    
    // This is a simple markdown formatter, in a real app you would use a proper markdown library
    let formatted = text
      // Headers
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      
      // Lists
      .replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>\n</ul>')
      .replace(/^\s*\n[0-9]+\. (.*)/gim, '<ol>\n<li>$1</li>\n</ol>')
      
      // Paragraphs
      .replace(/^\s*\n\n/gim, '</p><p>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    
    // Wrap with paragraph tags
    formatted = '<p>' + formatted + '</p>';
    
    // Fix lists
    formatted = formatted
      .replace(/<\/ul>\s?<ul>/g, '')
      .replace(/<\/ol>\s?<ol>/g, '');
      
    return formatted;
  };
  
  return (
    <div className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
      {/* Article Header */}
      <div className="border-b p-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">{title || 'Untitled Article'}</h1>
            {modelName && (
              <div className="flex items-center mt-3">
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  Generated by {modelName}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Article Content */}
      <div className={cn(
        "p-6 article-content",
        isLoading ? "animate-pulse" : "animate-fade-in"
      )}>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
          </div>
        ) : (
          <div ref={contentRef} className="prose prose-blue max-w-none"></div>
        )}
      </div>
    </div>
  );
};

export default ArticleDisplay;
