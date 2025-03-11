
import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  strengths: string[];
}

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  
  const selectedModelData = models.find(model => model.id === selectedModel);
  
  return (
    <div className="relative w-full">
      <div
        className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm cursor-pointer hover:border-blue-300 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>{selectedModelData?.name || 'Select a model'}</span>
        </div>
        <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform", isOpen && "transform rotate-180")} />
      </div>
      
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 py-2 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto animate-scale-in">
          {models.map((model) => (
            <div key={model.id} className="relative">
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors",
                  model.id === selectedModel && "bg-blue-50"
                )}
                onClick={() => {
                  onModelSelect(model.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    model.id === selectedModel ? "bg-blue-500" : "bg-gray-300"
                  )}></div>
                  <span className={cn(
                    model.id === selectedModel ? "font-medium text-blue-600" : "text-gray-700"
                  )}>
                    {model.name}
                  </span>
                </div>
                <button
                  className="text-gray-400 hover:text-blue-500 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(showInfo === model.id ? null : model.id);
                  }}
                >
                  <Info size={16} />
                </button>
              </div>
              
              {showInfo === model.id && (
                <div className="mx-4 my-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600 animate-fade-in">
                  <p className="mb-2">{model.description}</p>
                  <div className="mt-2">
                    <p className="font-medium text-gray-700 mb-1">Best for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {model.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
