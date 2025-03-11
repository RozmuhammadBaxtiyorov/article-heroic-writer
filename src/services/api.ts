
import { toast } from 'sonner';

// OpenRouter API endpoint
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Store API key in constant for now - in production, use environment variables
const API_KEY = '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';

export interface GenerateArticleParams {
  topic: string;
  type: string;
  length: 'short' | 'medium' | 'long';
  tone: string;
  modelId: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  modelId: string;
  modelName: string;
  createdAt: string;
}

// Define the AI models available in the app
export const AI_MODELS = [
  {
    id: 'deepseek/deepseek-r1-zero:free',
    name: 'DeepSeek R1 Zero',
    description: 'Excellent for analytical content and detailed explanations.',
    strengths: ['Research summaries', 'Technical writing', 'Educational content'],
  },
  {
    id: 'qwen/qwq-32b:free',
    name: 'Qwen 32B',
    description: 'Versatile model with strong creative writing abilities.',
    strengths: ['Creative content', 'Story development', 'Diverse writing styles'],
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    description: 'Strong reasoning and structured knowledge.',
    strengths: ['Academic writing', 'Complex topics', 'Thorough explanations'],
  },
  {
    id: 'moonshotai/moonlight-16b-a3b-instruct:free',
    name: 'Moonlight 16B',
    description: 'Well-rounded model with excellent instruction following.',
    strengths: ['Balanced content', 'Following specific guidelines', 'Clear structure'],
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    description: 'Meta\'s largest model with exceptional comprehension and output quality.',
    strengths: ['High-quality output', 'Complex reasoning', 'Natural language generation'],
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    description: 'Efficient model with good balance of quality and speed.',
    strengths: ['Faster generation', 'Concise writing', 'Basic content creation'],
  },
  {
    id: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
    name: 'Nemotron 70B',
    description: 'NVIDIA-optimized model with excellent performance.',
    strengths: ['Comprehensive content', 'Contextual understanding', 'Thorough responses'],
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    description: 'Efficient model with excellent instruction following.',
    strengths: ['Concise writing', 'Clear explanations', 'Good for specific formats'],
  },
];

// Helper to get model name from ID
export const getModelNameById = (modelId: string): string => {
  const model = AI_MODELS.find(m => m.id === modelId);
  return model ? model.name : 'AI Model';
};

// Generate prompt for article creation
const generatePrompt = (params: GenerateArticleParams): string => {
  const { topic, type, length, tone } = params;
  
  let wordCount = '500-800';
  if (length === 'short') wordCount = '300-500';
  if (length === 'long') wordCount = '1000-1500';
  
  return `
  Write a high-quality ${type} about "${topic}". 
  
  The ${type} should be approximately ${wordCount} words in length.
  
  Use a ${tone} tone throughout the ${type}.
  
  Include:
  - A compelling title
  - A well-structured introduction that engages the reader
  - Several main sections with appropriate headings
  - A conclusion that summarizes the key points
  
  Format the content using Markdown syntax with headers, paragraphs, and bullet points where appropriate.
  
  Start with the title on the first line preceded by a # symbol, then write the full article.
  Make sure your output contains ONLY the article - no additional comments or meta information.
  `;
};

// Generate an article using OpenRouter API
export const generateArticle = async (params: GenerateArticleParams): Promise<Article> => {
  try {
    const { modelId } = params;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ArticleHero',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'user',
            content: generatePrompt(params),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate article');
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || '';
    
    // Extract title from content (assumes first line is # Title)
    let title = 'Untitled Article';
    let content = generatedText;
    
    const titleMatch = generatedText.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1];
      // Remove the title from the content
      content = generatedText.replace(/^#\s+(.+)$/m, '').trim();
    }
    
    const article: Article = {
      id: Date.now().toString(),
      title,
      content,
      modelId,
      modelName: getModelNameById(modelId),
      createdAt: new Date().toISOString(),
    };
    
    // Save to local storage
    saveArticle(article);
    
    return article;
  } catch (error) {
    console.error('Error generating article:', error);
    toast.error('Failed to generate article. Please try again.');
    throw error;
  }
};

// Save article to local storage
export const saveArticle = (article: Article): void => {
  try {
    const savedArticles = localStorage.getItem('articlehero_articles');
    let articles: Article[] = savedArticles ? JSON.parse(savedArticles) : [];
    
    articles = [article, ...articles];
    localStorage.setItem('articlehero_articles', JSON.stringify(articles));
  } catch (error) {
    console.error('Error saving article:', error);
    toast.error('Failed to save article to local storage');
  }
};

// Get all saved articles
export const getSavedArticles = (): Article[] => {
  try {
    const savedArticles = localStorage.getItem('articlehero_articles');
    return savedArticles ? JSON.parse(savedArticles) : [];
  } catch (error) {
    console.error('Error retrieving articles:', error);
    toast.error('Failed to retrieve saved articles');
    return [];
  }
};

// Get a specific article by ID
export const getArticleById = (id: string): Article | null => {
  try {
    const articles = getSavedArticles();
    return articles.find(article => article.id === id) || null;
  } catch (error) {
    console.error('Error retrieving article:', error);
    toast.error('Failed to retrieve article');
    return null;
  }
};

// Delete an article
export const deleteArticle = (id: string): boolean => {
  try {
    const articles = getSavedArticles();
    const updatedArticles = articles.filter(article => article.id !== id);
    localStorage.setItem('articlehero_articles', JSON.stringify(updatedArticles));
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    toast.error('Failed to delete article');
    return false;
  }
};

// Generate and download PDF
export const generatePDF = async (article: Article): Promise<void> => {
  try {
    // In a real app, you'd use a proper PDF generation library
    // For now, we'll create a simple HTML document and trigger a download
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${article.title}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 20px;
            color: #1a1a1a;
          }
          h2 {
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #333;
          }
          p {
            margin-bottom: 16px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${article.title}</h1>
        <div>${formatHTMLContent(article.content)}</div>
        <div class="footer">
          Generated by ArticleHero using ${article.modelName} on ${new Date(article.createdAt).toLocaleDateString()}
        </div>
      </body>
      </html>
    `;
    
    // Create a Blob object with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    toast.success('PDF export prepared successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF');
  }
};

// Format content for HTML display
const formatHTMLContent = (markdown: string): string => {
  // This is a simple markdown to HTML converter for the PDF export
  // In a real app, you would use a proper markdown library
  return markdown
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
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /^<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
    })
    
    // Fix lists
    .replace(/<\/ul>\s?<ul>/g, '')
    .replace(/<\/ol>\s?<ol>/g, '')
    
    // Handle line breaks
    .replace(/\n/gim, '<br>');
};
