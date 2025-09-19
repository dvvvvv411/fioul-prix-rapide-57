
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Nos délais de livraison sont généralement de 24 à 48h en France métropolitaine. Pour les commandes passées avant 14h, la livraison peut souvent être effectuée le lendemain. Les délais peuvent varier selon votre localisation géographique."
    },
    {
      question: "Comment calculer mes besoins en fioul ?",
      answer: "En moyenne, comptez 15 à 20 litres de fioul par m² et par an pour une maison bien isolée. Utilisez notre calculateur en ligne pour une estimation plus précise selon vos paramètres spécifiques (surface, isolation, usage)."
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires, et les chèques. Tous les paiements en ligne sont sécurisés par cryptage SSL et nos partenaires bancaires certifiés."
    },
    {
      question: "Livrez-vous partout en France ?",
      answer: "Oui, nous livrons dans toute la France métropolitaine. Certaines zones géographiques peuvent avoir des délais légèrement prolongés. Contactez-nous pour plus d'informations sur votre zone de livraison."
    },
    {
      question: "Quelle est la différence entre Standard et Premium ?",
      answer: "Le fioul Premium contient des additifs spéciaux qui améliorent les performances : combustion plus propre, protection anticorrosion, durée de stockage prolongée et protection de votre installation. Le fioul Standard offre une qualité fiable pour un usage quotidien."
    },
    {
      question: "Y a-t-il une commande minimum ?",
      answer: "Oui, la commande minimum est de 1000 litres. La livraison devient gratuite à partir de 2000 litres. En dessous de ce seuil, des frais de livraison de 39€ s'appliquent."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-red-50/40 via-white to-orange-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-bl from-orange-200/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-total-blue">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Vous avez d'autres questions ?
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 bg-total-blue text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
