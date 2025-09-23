import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Flame, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProductComparison = () => {
  const navigate = useNavigate();

  const comparisonFeatures = [
    { feature: "Prix au litre", standard: "0,70€", premium: "0,73€" },
    { feature: "Conformité normes", standard: true, premium: true },
    { feature: "Additifs anticorrosion", standard: false, premium: true },
    { feature: "Additifs nettoyants", standard: false, premium: true },
    { feature: "Performance optimisée", standard: false, premium: true },
    { feature: "Durée de stockage prolongée", standard: false, premium: true },
    { feature: "Protection installation", standard: false, premium: true },
  ];

  const handleScrollToComparison = () => {
    const element = document.querySelector('section[data-section="comparison"]');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToLanding = () => {
    navigate('/#hero');
  };

  return (
    <section id="comparison-section" className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/15 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comparaison Détaillée
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le fioul qui correspond parfaitement à vos besoins et à votre budget
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Standard Product */}
          <Card className="relative hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-blue-50/30 to-white border-2 border-blue-100/50 hover:border-blue-200 group hover:scale-105">
            <CardHeader className="text-center pb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 border-4 border-white shadow-lg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Flame className="text-total-blue" size={36} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Fioul Standard</CardTitle>
                <div className="text-4xl font-bold text-total-blue mt-2 mb-2">
                  0,70€<span className="text-lg text-gray-600 font-normal">/litre</span>
                </div>
                <p className="text-gray-600 text-sm bg-gray-50 px-4 py-2 rounded-full inline-block">
                  Solution économique et fiable
                </p>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                  <Check className="text-success-green" size={18} />
                  <span className="text-gray-700 font-medium">Rapport qualité-prix optimal</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                  <Check className="text-success-green" size={18} />
                  <span className="text-gray-700 font-medium">Conforme aux normes françaises</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                  <Check className="text-success-green" size={18} />
                  <span className="text-gray-700 font-medium">Livraison rapide et fiable</span>
                </div>
              </div>
              <Button 
                onClick={handleGoToLanding}
                className="w-full bg-gradient-to-r from-total-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                Choisir Standard
              </Button>
            </CardContent>
          </Card>

          {/* Premium Product */}
          <Card className="relative hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-total-red hover:border-red-600 group hover:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <Badge className="bg-gradient-to-r from-total-red to-red-600 text-white px-6 py-2 text-sm font-bold shadow-lg animate-pulse">
                Recommandé
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-6 pt-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 border-4 border-white shadow-lg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="text-total-red" size={36} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Fioul Premium</CardTitle>
                <div className="text-4xl font-bold text-total-red mt-2 mb-2">
                  0,73€<span className="text-lg text-gray-600 font-normal">/litre</span>
                </div>
                <p className="text-gray-600 text-sm bg-red-50 px-4 py-2 rounded-full inline-block">
                  Enrichi avec additifs premium
                </p>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg">
                  <Check className="text-success-green" size={18} />
                  <span className="text-gray-700 font-medium">Performance optimisée</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg">
                  <Check className="text-success-green" size={18} />
                  <span className="text-gray-700 font-medium">Additifs anticorrosion</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg">
                  <Check className="text-success-green" size={18} />
                  <span className="text-gray-700 font-medium">Protection installation</span>
                </div>
              </div>
              <Button 
                onClick={handleGoToLanding}
                className="w-full bg-gradient-to-r from-total-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                Choisir Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
