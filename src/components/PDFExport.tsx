
import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFExportProps {
  title: string;
  content: string;
  isGenerating: boolean;
  onExport: () => void;
}

const PDFExport: React.FC<PDFExportProps> = ({
  title,
  content,
  isGenerating,
  onExport,
}) => {
  const isDisabled = !content || isGenerating;
  
  return (
    <div className="w-full p-4 bg-gray-50 border rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
        </div>
        
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-gray-600">
            Export your generated content as a professionally formatted PDF document.
          </p>
          
          <button
            onClick={onExport}
            disabled={isDisabled}
            className={cn(
              "flex items-center justify-center px-4 py-2 rounded-md transition-all",
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Export as PDF
              </>
            )}
          </button>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>Note: The PDF will include the article title, content, and attribution to ArticleHero.</p>
        </div>
      </div>
    </div>
  );
};

export default PDFExport;
