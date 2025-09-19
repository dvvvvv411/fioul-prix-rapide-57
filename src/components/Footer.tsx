
import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="https://i.imgur.com/NqMqAH6.png" 
              alt="Total Fioul France"
              className="h-24 mb-4"
            />
            <p className="text-gray-300 mb-4">
              Votre partenaire de confiance pour l'approvisionnement en fioul domestique en France.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@total-fioul.fr</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Partout en France</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-white" onClick={scrollToTop}>Accueil</Link></li>
              <li><Link to="/produits" className="hover:text-white" onClick={scrollToTop}>Produits</Link></li>
              <li><Link to="/livraison" className="hover:text-white" onClick={scrollToTop}>Livraison</Link></li>
              <li><Link to="/contact" className="hover:text-white" onClick={scrollToTop}>Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Informations Légales</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/mentions-legales" className="hover:text-white" onClick={scrollToTop}>Mentions légales</Link></li>
              <li><Link to="/cgv" className="hover:text-white" onClick={scrollToTop}>CGV</Link></li>
              <li><Link to="/politique-confidentialite" className="hover:text-white" onClick={scrollToTop}>Politique de confidentialité</Link></li>
              <li><Link to="/politique-cookies" className="hover:text-white" onClick={scrollToTop}>Politique de cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center text-gray-400">
            © 2025 Total Fioul France. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
