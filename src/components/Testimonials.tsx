
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      location: "Lyon",
      text: "Livraison ponctuelle et service impeccable. Je recommande vivement Total Fioul France !",
      rating: 5
    },
    {
      name: "Pierre Martin",
      location: "Marseille", 
      text: "Prix compétitifs et fioul de qualité. La commande en ligne est très simple.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      location: "Toulouse",
      text: "Commande simple et livraison rapide. Service client très réactif en cas de question.",
      rating: 5
    },
    {
      name: "Jean-Michel Bernard",
      location: "Nantes",
      text: "Excellent service ! Le calculateur de prix est très pratique et transparent.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 via-orange-50/60 to-red-50/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/25 to-red-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-tl from-red-300/30 to-orange-300/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-200/20 to-red-200/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              Témoignages Clients
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ils nous font confiance pour leur fioul
          </p>
          
          {/* Modern Trust Badge */}
          <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-amber-400 fill-current" size={24} />
              ))}
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="text-left">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">4.9/5</div>
              <div className="text-sm text-gray-600">sur 1,247 avis</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-white/60 hover:border-orange-200/60 hover:-translate-y-2 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              
              <CardContent className="p-6 relative">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={32} className="text-orange-600" />
                </div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-current" size={18} />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic leading-relaxed text-base">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
