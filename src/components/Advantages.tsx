
import { Check, Truck, Shield, Award, Phone, CreditCard, Star, Flame } from 'lucide-react';

const Advantages = () => {
  const advantages = [
    {
      icon: Truck,
      title: "Transport offert dès 2000L",
      description: "Réalisez des économies sur les coûts d'acheminement"
    },
    {
      icon: Check,
      title: "Tarifs clairs sans dissimulation",
      description: "Aucun coût masqué, tout est explicite"
    },
    {
      icon: Flame,
      title: "Acheminement express national",
      description: "Service territorial d'excellence"
    },
    {
      icon: Phone,
      title: "Assistance clientèle dynamique",
      description: "Support accessible et expert"
    },
    {
      icon: CreditCard,
      title: "Règlement protégé",
      description: "Opérations blindées et sûres"
    },
    {
      icon: Star,
      title: "Excellence homologuée",
      description: "Combustible aux normes hexagonales"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50/80 via-white to-red-50/60 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-200/15 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/10 to-red-100/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Engagements
          </h2>
          <p className="text-xl text-gray-600">
            Votre contentement constitue notre préoccupation première
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center transition-colors">
                  <IconComponent size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
