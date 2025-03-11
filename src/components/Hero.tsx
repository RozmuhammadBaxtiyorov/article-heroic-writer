
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="text-center">
          <h1 className="mt-16 mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Elevate Your Reading &<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              Writing Experience
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto mt-5 text-xl text-gray-500 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Generate high-quality articles, blogs, and ebooks powered by advanced AI models to enhance your reading skills and content creation.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <Link 
              to="/generate" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles size={18} className="mr-2" />
              Generate Content
              <ArrowRight size={16} className="ml-2" />
            </Link>
            
            <Link 
              to="/articles" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <BookOpen size={18} className="mr-2" />
              My Articles
            </Link>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            Powered by Advanced AI Models
          </h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up" style={{ animationDelay: '0.9s' }}>
            <FeatureCard 
              icon={<Sparkles className="h-8 w-8 text-blue-500" />}
              title="Diverse AI Models"
              description="Access multiple state-of-the-art AI models like Llama, Mistral, and DeepSeek to generate tailored content."
            />
            
            <FeatureCard 
              icon={<FileText className="h-8 w-8 text-blue-500" />}
              title="Rich Article Generation"
              description="Create polished articles, blog posts, and reports with AI that adapts to your preferences."
            />
            
            <FeatureCard 
              icon={<Download className="h-8 w-8 text-blue-500" />}
              title="PDF Export"
              description="Export your generated content as beautifully formatted PDFs ready to download and share."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Hero;
