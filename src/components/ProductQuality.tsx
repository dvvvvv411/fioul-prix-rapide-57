import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Truck, Clock, ThermometerSun, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductQuality = () => {
  const navigate = useNavigate();

  const handleGoToLanding = () => {
    navigate('/#hero');
  };

  const handleGoToContact = () => {
    navigate('/contact');
  };

  const qualityFeatures = [
    {
      icon: Shield,
      title: "Conformité Garantie",
      description: "Tous nos produits respectent strictement les normes françaises NF EN 14214 et sont régulièrement contrôlés par des laboratoires indépendants.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Award,
      title: "Certification Qualité",
      description: "Fioul certifié ISO 9001 avec traçabilité complète depuis le raffinage jusqu'à la livraison chez vous.",
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      icon: ThermometerSun,
      title: "Performance Thermique",
      description: "Pouvoir calorifique optimal garanti à 42,6 MJ/kg minimum pour un rendement énergétique maximal de votre installation.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Droplets,
      title: "Pureté Maximale",
      description: "Filtration avancée en triple étape éliminant toutes les impuretés et garantissant une combustion propre et efficace.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100"
    },
    {
      icon: Clock,
      title: "Stabilité Longue Durée",
      description: "Additifs antioxydants brevetés permettant un stockage jusqu'à 12 mois sans altération des propriétés du fioul.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Truck,
      title: "Livraison Sécurisée",
      description: "Transport par camions-citernes certifiés ADR avec suivi GPS en temps réel et respect des normes de sécurité les plus strictes.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const processSteps = [
    { step: "1", title: "Raffinage", description: "Distillation fractionnée dans nos raffineries partenaires" },
    { step: "2", title: "Contrôle", description: "Tests qualité en laboratoire indépendant" },
    { step: "3", title: "Additifs", description: "Enrichissement avec additifs premium sélectionnés" },
    { step: "4", title: "Stockage", description: "Conservation dans cuves certifiées en conditions optimales" },
    { step: "5", title: "Livraison", description: "Transport sécurisé jusqu'à votre domicile" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/30 via-white to-gray-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-purple-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Qualité & Assurance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Notre engagement pour vous fournir le fioul de la plus haute qualité, 
            de la production à la livraison
          </p>
        </div>

        {/* Quality Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {qualityFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.color}`} size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Timeline */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Processus Qualité
            </h3>
            <p className="text-lg text-gray-600">
              De la raffinerie à votre cuve, découvrez les 5 étapes qui garantissent l'excellence
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((process, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-total-blue to-total-red rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto group-hover:scale-110 transition-transform shadow-lg">
                    {process.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-total-blue/50 to-total-red/50 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  {process.title}
                </h4>
                <p className="text-xs text-gray-600 leading-tight">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-total-blue to-total-red p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">
              Garantie Qualité 100% Satisfait ou Remboursé
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Nous sommes si confiants dans la qualité de nos produits que nous offrons une garantie de satisfaction complète
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGoToLanding}
                className="bg-white text-total-blue px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                En savoir plus
              </button>
              <button 
                onClick={handleGoToContact}
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductQuality;
