import { Button } from '@/components/ui/button';
import { Flame, Star, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductHero = () => {
  const navigate = useNavigate();

  const handleGoToLanding = () => {
    navigate('/#hero');
  };

  const handleScrollToComparison = () => {
    const element = document.getElementById('comparison-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50/90 via-orange-50/70 to-amber-50/80 py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-bl from-orange-300/30 to-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200/25 to-orange-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-200/20 to-orange-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50/95 to-red-50/95 backdrop-blur-sm border border-orange-200/60 rounded-full px-6 py-3 mb-8 hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
              <Flame size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Gamme Complète Fioul Domestique</span>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Nos Produits
            </span>
            <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
              Fioul Premium
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto font-light animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Découvrez notre gamme complète de fioul domestique, du Standard économique au Premium haute performance, 
            tous certifiés conformes aux normes françaises les plus strictes
          </p>

          {/* Product highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Flame size={20} className="text-total-blue" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Fioul Standard</div>
                <div className="text-xs text-gray-500">0,70€/L</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Star size={20} className="text-total-red" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Fioul Premium</div>
                <div className="text-xs text-gray-500">0,73€/L</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-success-green" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Qualité certifiée</div>
                <div className="text-xs text-gray-500">garantie</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <Button 
              onClick={handleGoToLanding}
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group hover:scale-105"
            >
              Commander maintenant
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={handleScrollToComparison}
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Comparer les produits
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
