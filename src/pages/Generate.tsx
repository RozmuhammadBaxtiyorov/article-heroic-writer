
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ModelSelector, { AIModel } from '@/components/ModelSelector';
import ArticleDisplay from '@/components/ArticleDisplay';
import PDFExport from '@/components/PDFExport';
import { generateArticle, generatePDF, AI_MODELS, getModelNameById } from '@/services/api';
import { toast } from 'sonner';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  modelId: string;
}

const Generate: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('article');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState('informative');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[4].id); // Default to Llama 3.3 70B
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<ArticleData | null>(null);
  
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for your article');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedArticle(null);
    
    try {
      const article = await generateArticle({
        topic,
        type,
        length,
        tone,
        modelId: selectedModel,
      });
      
      setGeneratedArticle(article);
      toast.success('Article generated successfully!');
    } catch (error) {
      console.error('Error generating article:', error);
      toast.error('Failed to generate article. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleExportPDF = async () => {
    if (!generatedArticle) return;
    
    setIsExporting(true);
    try {
      await generatePDF({
        ...generatedArticle,
        modelName: getModelNameById(generatedArticle.modelId),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Content</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Generation Form */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Content Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic or Title
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic or title"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="article">Article</option>
                    <option value="blog post">Blog Post</option>
                    <option value="essay">Essay</option>
                    <option value="report">Report</option>
                    <option value="story">Story</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Length
                  </span>
                  <div className="flex space-x-4">
                    {['short', 'medium', 'long'].map((option) => (
                      <label
                        key={option}
                        className="flex items-center"
                      >
                        <input
                          type="radio"
                          value={option}
                          checked={length === option}
                          onChange={() => setLength(option as any)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                    Tone
                  </label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="informative">Informative</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AI Model
                  </label>
                  <ModelSelector
                    models={AI_MODELS}
                    selectedModel={selectedModel}
                    onModelSelect={setSelectedModel}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Different models have different strengths. Choose the one that best fits your needs.
                  </p>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {generatedArticle && (
              <PDFExport
                title={generatedArticle.title}
                content={generatedArticle.content}
                isGenerating={isExporting}
                onExport={handleExportPDF}
              />
            )}
          </div>
          
          {/* Right Column: Preview */}
          <div className="md:col-span-2">
            <ArticleDisplay
              title={generatedArticle?.title || ''}
              content={generatedArticle?.content || ''}
              isLoading={isGenerating}
              modelName={generatedArticle ? getModelNameById(generatedArticle.modelId) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
