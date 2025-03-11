
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, Trash2, Search, Clock, FileText } from 'lucide-react';
import { getSavedArticles, deleteArticle, generatePDF, Article } from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);
  
  useEffect(() => {
    loadArticles();
  }, []);
  
  const loadArticles = () => {
    const savedArticles = getSavedArticles();
    setArticles(savedArticles);
  };
  
  const handleCopyContent = (article: Article) => {
    navigator.clipboard.writeText(article.content)
      .then(() => toast.success('Article content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };
  
  const handleExportPDF = async (article: Article) => {
    setExportingId(article.id);
    try {
      await generatePDF(article);
    } finally {
      setExportingId(null);
    }
  };
  
  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const success = deleteArticle(id);
      if (success) {
        setArticles(articles.filter(article => article.id !== id));
        toast.success('Article deleted');
      }
    }
  };
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Articles</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Link
              to="/generate"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Article
            </Link>
          </div>
        </div>
        
        {articles.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No articles yet</h2>
            <p className="text-gray-500 mb-6">Generate your first article to see it here</p>
            <Link
              to="/generate"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate New Article
            </Link>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                      {article.title}
                    </h2>
                    
                    <div className="flex items-center mb-3 space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.modelName}
                      </span>
                      
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 line-clamp-3">
                      {article.content.slice(0, 200)}...
                    </p>
                  </div>
                  
                  <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-2 mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => handleCopyContent(article)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      title="Copy content"
                    >
                      <Copy size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleExportPDF(article)}
                      disabled={exportingId === article.id}
                      className={cn(
                        "inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors",
                        exportingId === article.id && "opacity-50 cursor-not-allowed"
                      )}
                      title="Export as PDF"
                    >
                      <Download size={16} className={cn(exportingId === article.id && "animate-pulse")} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
