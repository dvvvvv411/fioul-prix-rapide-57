
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Flame, Star } from 'lucide-react';

const ProductsSection = () => {
  const standardFeatures = [
    "Rapport qualité-prix optimal",
    "Conforme aux normes françaises",
    "Livraison rapide et fiable",
    "Service client dédié"
  ];

  const premiumFeatures = [
    "Performance constante grâce aux additifs spéciaux",
    "Combustion plus propre avec résidus minimaux",
    "Durée de stockage prolongée",
    "Protection de votre installation de chauffage",
    "Additifs anticorrosion et nettoyants"
  ];

  return (
    <section id="produits" className="py-16 bg-gradient-to-br from-blue-50/60 via-gray-50/80 to-orange-50/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits Fioul
          </h2>
          <p className="text-xl text-gray-600">
            Choisissez la qualité qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Standard Product */}
          <Card className="relative hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border-white/40">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Flame className="text-total-blue" size={32} />
              </div>
              <CardTitle className="text-2xl text-gray-900">Fioul Standard</CardTitle>
              <div className="text-3xl font-bold text-total-blue mt-2">
                0,70€<span className="text-lg text-gray-600">/litre</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                Fioul de qualité pour un usage quotidien
              </p>
              
              <div className="space-y-3 mb-8">
                {standardFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="text-success-green mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-total-blue hover:bg-blue-800 text-white">
                Choisir Standard
              </Button>
            </CardContent>
          </Card>

          {/* Premium Product */}
          <Card className="relative hover:shadow-lg transition-shadow border-total-red border-2 bg-white/90 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-total-red text-white px-4 py-1">
                Recommandé
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Star className="text-total-red" size={32} />
              </div>
              <CardTitle className="text-2xl text-gray-900">Fioul Premium</CardTitle>
              <div className="text-3xl font-bold text-total-red mt-2">
                0,73€<span className="text-lg text-gray-600">/litre</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                Fioul haut de gamme enrichi avec des additifs
              </p>
              
              <div className="space-y-3 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="text-success-green mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-total-red hover:bg-red-700 text-white">
                Choisir Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
