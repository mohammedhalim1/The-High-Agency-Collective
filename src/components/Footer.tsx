import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer 
      className="footer-background py-12 bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/assets/footer_background.jpg')`
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/assets/Gold HA negative background (1).svg"
              alt="High Agency Collective Logo"
              className="logo-rounded w-40 h-40 md:w-48 md:h-48"
              onError={(e) => {
                // Fallback to simple logo if image fails to load
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) nextElement.style.display = 'flex';
              }}
            />
            {/* Fallback logo */}
            <div className="hidden w-40 h-40 md:w-48 md:h-48 rounded-xl items-center justify-center" style={{background: 'var(--gradient-primary)'}}>
              <span className="text-light font-bold text-4xl md:text-5xl heading-primary">HA</span>
            </div>
            <h3 className="text-light font-semibold text-lg heading-secondary">High Agency Collective</h3>
            <p className="text-light-muted text-sm leading-relaxed body-text">
              Empowering women to embrace their feminine strength and create lives of purpose, balance, and authentic joy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-light heading-secondary">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                About
              </Link>
              <Link to="/services" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Services
              </Link>
              <Link to="/transform" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Transform
              </Link>
              <Link to="/contact" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal & Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-light heading-secondary">
              Legal
            </h4>
            <div className="flex flex-col space-y-2">
              <Link to="/terms-conditions" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Privacy Policy
              </Link>
              <Link to="/refund-policy" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Refund & Cancellation Policy
              </Link>
            </div>

            <h4 className="text-lg font-semibold text-light heading-secondary mt-6">
              Connect
            </h4>
            <div className="flex flex-col space-y-2">
              <a href="https://www.instagram.com/highagencycollective" target="_blank" rel="noopener noreferrer" className="text-light-muted hover:text-light transition-colors text-sm body-text">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center" style={{borderTop: '1px solid var(--text-light-muted)'}}>
          <p className="text-light-muted text-sm body-text">
            © 2025 HA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
