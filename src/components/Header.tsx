
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, Layout, Eye } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-serif text-xl font-bold">
            Idea Publish Hub
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layout className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            to="/editor" 
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/editor' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PenSquare className="h-4 w-4" />
            New Post
          </Link>
          <Link 
            to="/preview" 
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/preview' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="h-4 w-4" />
            Public View
          </Link>
        </nav>
        
        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Layout className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/editor" 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/editor' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <PenSquare className="h-4 w-4" />
              New Post
            </Link>
            <Link 
              to="/preview" 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/preview' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Eye className="h-4 w-4" />
              Public View
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
