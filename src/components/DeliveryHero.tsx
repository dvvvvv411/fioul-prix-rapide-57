import { Button } from '@/components/ui/button';
import { Truck, ChevronRight, Shield, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeliveryHero = () => {
  const navigate = useNavigate();

  const handleGoToLanding = () => {
    navigate('/#hero');
  };

  const handleGoToContact = () => {
    navigate('/contact');
  };

  return (
    <section className="bg-gradient-to-br from-blue-50/90 via-orange-50/70 to-amber-50/80 py-16 md:py-24 relative overflow-hidden">
      {/* Enhanced welcoming background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-bl from-orange-300/30 to-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200/25 to-orange-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-200/20 to-orange-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-200/20 to-amber-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating elements for more welcoming feel */}
        <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-orange-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-amber-400/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Animated Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50/95 to-red-50/95 backdrop-blur-sm border border-orange-200/60 rounded-full px-6 py-3 mb-8 hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
              <Truck size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Livraison Professionnelle</span>
            <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Animated Headlines */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Livraison rapide
            </span>
            <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
              partout en France
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto font-light animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Service de livraison professionnel avec suivi GPS en temps réel. 
            Livraison gratuite dès 2000L dans toute la France métropolitaine
          </p>

          {/* Animated Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Livraison gratuite</div>
                <div className="text-xs text-gray-500">dès 2000L</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Livraison rapide</div>
                <div className="text-xs text-gray-500">48-72h</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-amber-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Toute la France</div>
                <div className="text-xs text-gray-500">métropolitaine</div>
              </div>
            </div>
          </div>

          {/* Animated CTA Buttons */}
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
              onClick={handleGoToContact}
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryHero;
