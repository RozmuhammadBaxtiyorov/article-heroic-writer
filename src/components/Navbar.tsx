
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookText, PenTool, LayoutList, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navItems = [
    { name: 'Home', path: '/', icon: BookText },
    { name: 'Generate', path: '/generate', icon: PenTool },
    { name: 'My Articles', path: '/articles', icon: LayoutList },
  ];
  
  return (
    <nav className={cn(
      "fixed w-full top-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                ArticleHero
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-all",
                  location.pathname === item.path 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                )}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden h-screen bg-white/95 backdrop-blur-lg animate-fade-in">
          <div className="pt-2 pb-4 space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 py-3 px-3 rounded-lg transition-all",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
