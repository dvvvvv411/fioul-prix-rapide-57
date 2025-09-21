
import { Check } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Excellence et fiabilité",
      description: "Notre gamme répond aux standards les plus élevés établis par les normes hexagonales. Chaque approvisionnement fait l'objet d'un contrôle strict afin d'assurer un combustible domestique d'excellence qui optimise le rendement de votre système de chauffage."
    },
    {
      title: "Accompagnement spécialisé",
      description: "Notre équipe d'experts vous conseille dans la sélection adaptée à vos besoins énergétiques. Joignables par téléphone ou via notre plateforme, nos spécialistes vous orientent pour personnaliser votre commande et maîtriser votre consommation."
    },
    {
      title: "Tarification claire",
      description: "Aucun coût dissimulé, aucune mauvaise surprise sur votre facture. Nos montants sont explicitement indiqués et englobent l'ensemble des frais. Vous réglez précisément ce qui vous est présenté, avec la possibilité d'évaluer nos tarifs instantanément."
    },
    {
      title: "Procédure d'achat facilitée",
      description: "Finalisez votre achat en quelques manipulations sur notre interface ergonomique. Surveillez votre approvisionnement en temps réel et administrez aisément vos factures depuis votre espace client dédié."
    },
    {
      title: "Acheminement ponctuel",
      description: "Respect rigoureux des plages horaires d'acheminement établies. Notre réseau de transporteurs qualifiés garantit un service sécurisé sur l'ensemble du territoire, avec géolocalisation et alerte de passage."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-red-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content (60%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Excellentes raisons
                </span>
                <br />
                <span className="text-gray-900">
                  de nous préférer
                </span>
              </h1>
            </div>

            {/* Benefits List */}
            <div className="space-y-8 mt-12">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-white/60 hover:shadow-lg transition-all duration-300 cursor-pointer hover:transform hover:translate-x-2"
                >
                  {/* Checkmark Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-2 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Check className="w-full h-full text-white stroke-[3]" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-total-blue transition-colors">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Hero Image (40%) */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="relative">
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img 
                  src="/happy-couple.png"
                  alt="Équipe spécialisée Fioul 24"
                  className="w-full h-[500px] lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-80 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-red-400 to-orange-500 rounded-full opacity-70 blur-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
