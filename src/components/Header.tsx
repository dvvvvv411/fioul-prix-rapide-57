
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleCommanderClick = () => {
    // Only scroll if we're on the homepage
    if (location.pathname === '/') {
      const element = document.getElementById('price-calculator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = '/#price-calculator';
    }
  };

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-total-red text-white py-2 px-4 text-center text-sm font-medium">
        🚚 Livraison gratuite à partir de 2000L - Partout en France
      </div>
      
      {/* Main Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28 md:justify-between">
            {/* Mobile Menu Button - Left side on mobile */}
            <button
              className="md:hidden order-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Centered on mobile, left on desktop */}
            <div className="flex items-center order-2 md:order-1 flex-1 md:flex-none justify-center md:justify-start">
              <Link to="/">
                <img 
                  src="https://i.imgur.com/NqMqAH6.png" 
                  alt="Total Fioul France"
                  className="h-24"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 order-3 md:order-2">
              <Link to="/" className="text-gray-700 hover:text-total-blue font-medium">
                Accueil
              </Link>
              <Link to="/produits" className="text-gray-700 hover:text-total-blue font-medium">
                Produits
              </Link>
              <Link to="/livraison" className="text-gray-700 hover:text-total-blue font-medium">
                Livraison
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-total-blue font-medium">
                Contact
              </Link>
              <Button 
                onClick={handleCommanderClick}
                className="bg-total-red hover:bg-red-700 text-white font-bold"
              >
                Commander maintenant
              </Button>
            </nav>

            {/* Spacer for mobile to balance the layout */}
            <div className="md:hidden order-3 w-6"></div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-total-blue font-medium">
                  Accueil
                </Link>
                <Link to="/produits" className="text-gray-700 hover:text-total-blue font-medium">
                  Produits
                </Link>
                <Link to="/livraison" className="text-gray-700 hover:text-total-blue font-medium">
                  Livraison
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-total-blue font-medium">
                  Contact
                </Link>
                <Button 
                  onClick={handleCommanderClick}
                  className="bg-total-red hover:bg-red-700 text-white font-bold w-full"
                >
                  Commander maintenant
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
