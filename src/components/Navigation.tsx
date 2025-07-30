import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Transform', path: '/transform' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative z-50 bg-[#4e342e] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-1.5">
          {/* Logo - Optimized for dark brown background */}
          <Link to="/" className="flex items-center p-1">
            <img 
              src="/assets/Gold HA negative background (1).svg" 
              alt="Site Logo" 
              className="logo-rounded w-32 h-32 drop-shadow-xl filter brightness-125 contrast-125"
              onError={(e) => {
                // Fallback to a simple placeholder if logo fails to load
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) nextElement.style.display = 'flex';
              }}
            />
            {/* Fallback logo */}
            <div 
              className="hidden w-32 h-32 rounded-xl items-center justify-center drop-shadow-xl"
              style={{background: 'var(--gradient-primary)'}}
            >
              <span 
                className="text-light font-bold text-3xl drop-shadow-md" 
                style={{fontFamily: 'Playfair Display, serif'}}
              >
                HA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 body-text relative ${
                  isActive(item.path)
                    ? 'border-b-2 pb-1'
                    : 'hover:opacity-70'
                }`}
                style={{
                  color: isActive(item.path) ? 'var(--button-primary)' : '#ffffff',
                  borderColor: isActive(item.path) ? 'var(--button-primary)' : 'transparent'
                }}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="primary-button hover:scale-105 transition-transform duration-200"
            >
              Book Session
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="transition-colors duration-200 p-1 rounded-md hover:bg-white/10"
              style={{
                color: '#ffffff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden py-2 border-t border-white/20 bg-[#4e342e]/95 backdrop-blur-sm"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium transition-colors duration-200 body-text py-1 hover:opacity-70"
                  style={{
                    color: isActive(item.path) ? 'var(--button-primary)' : '#ffffff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="primary-button w-fit hover:scale-105 transition-transform duration-200"
              >
                Book Session
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;