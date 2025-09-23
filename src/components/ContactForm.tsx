
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-red-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Nous contacter
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Notre équipe de spécialistes vous accompagne dans le choix de vos besoins énergétiques. 
                Disponibles en ligne, nos conseillers vous guident pour optimiser votre commande.
              </p>
            </div>

            {/* Contact Cards - Phone removed */}
            <div className="space-y-6">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:transform hover:translate-x-2">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                      <Mail className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Contact par email
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Envoyez-nous un message, nous vous répondons sous 24h
                      </p>
                      <div className="space-y-1">
                        <p className="font-semibold text-lg text-gray-900">contact@total-fioul-france.fr</p>
                        <p className="text-gray-500 text-sm">Réponse garantie sous 24h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:transform hover:translate-x-2">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-3 shadow-lg">
                      <MapPin className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Zone de livraison
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Livraison rapide partout en France métropolitaine
                      </p>
                      <div className="space-y-1">
                        <p className="font-semibold text-lg text-gray-900">Toute la France</p>
                        <p className="text-gray-500 text-sm">Livraison gratuite dès 2000L</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Demande de contact
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Remplissez ce formulaire pour recevoir votre devis personnalisé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Votre téléphone"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet de votre demande
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="livraison">Question sur la livraison</option>
                      <option value="produits">Information sur les produits</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez votre besoin (quantité approximative, lieu de livraison, délai souhaité...)"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Envoyer ma demande
                    <Send size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    * Champs obligatoires. Vos données sont traitées de manière confidentielle.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
