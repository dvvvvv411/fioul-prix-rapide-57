
import { Calculator, ShoppingCart, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Calculator,
      title: "Calculez",
      description: "Utilisez notre calculateur pour estimer votre commande",
      step: "1"
    },
    {
      icon: ShoppingCart,
      title: "Commandez",
      description: "Finalisez votre achat en ligne en toute sécurité",
      step: "2"
    },
    {
      icon: Truck,
      title: "Recevez",
      description: "Livraison rapide directement chez vous",
      step: "3"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 via-orange-50/50 to-gray-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/40 to-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-red-200/35 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-100/50 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
              Comment ça marche ?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commander votre fioul en 3 étapes simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center relative group">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-500 to-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-orange-200/50">
                  <IconComponent size={48} className="text-gradient-to-br from-orange-600 to-red-600" style={{color: '#EA580C'}} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {step.title}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-orange-300 to-red-300"></div>
                    <div className="absolute -right-1 -top-1.5 w-0 h-0 border-l-6 border-l-red-400 border-y-3 border-y-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
