import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PolitiqueCookies = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Cookies</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p className="mb-4">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de reconnaître votre terminal lors de vos visites ultérieures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Pourquoi utilisons-nous des cookies ?</h2>
              <p className="mb-4">
                Total Pacifique Sàrl utilise des cookies pour :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Assurer le bon fonctionnement du site web</li>
                <li>Mémoriser vos préférences et paramètres</li>
                <li>Améliorer votre expérience de navigation</li>
                <li>Analyser l'utilisation du site</li>
                <li>Personnaliser le contenu et les publicités</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Types de cookies utilisés</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Cookies strictement nécessaires</h3>
              <p className="mb-4">
                Ces cookies sont indispensables au fonctionnement du site. Ils vous permettent de naviguer sur le site et d'utiliser ses fonctionnalités essentielles.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Exemples :</strong></p>
                <ul className="list-disc pl-6">
                  <li>Cookies de session</li>
                  <li>Cookies de sécurité</li>
                  <li>Cookies de préférences linguistiques</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Cookies de performance</h3>
              <p className="mb-4">
                Ces cookies collectent des informations sur la façon dont vous utilisez notre site web, comme les pages que vous visitez le plus souvent.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Finalités :</strong></p>
                <ul className="list-disc pl-6">
                  <li>Améliorer les performances du site</li>
                  <li>Comprendre comment les visiteurs utilisent le site</li>
                  <li>Identifier les problèmes techniques</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Cookies de fonctionnalité</h3>
              <p className="mb-4">
                Ces cookies permettent au site web de se souvenir des choix que vous faites et de fournir des fonctionnalités améliorées et personnalisées.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Exemples :</strong></p>
                <ul className="list-disc pl-6">
                  <li>Mémorisation de vos préférences</li>
                  <li>Personnalisation de l'interface</li>
                  <li>Sauvegarde de votre panier de commande</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Cookies publicitaires</h3>
              <p className="mb-4">
                Ces cookies sont utilisés pour diffuser des publicités pertinentes pour vous et vos intérêts.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Utilisation :</strong></p>
                <ul className="list-disc pl-6">
                  <li>Ciblage publicitaire</li>
                  <li>Mesure de l'efficacité des campagnes</li>
                  <li>Limitation du nombre d'affichages</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookies tiers</h2>
              <p className="mb-4">
                Notre site peut contenir des cookies provenant de partenaires tiers :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Google Analytics :</strong> analyse d'audience</li>
                <li><strong>Réseaux sociaux :</strong> boutons de partage</li>
                <li><strong>Partenaires publicitaires :</strong> publicités ciblées</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Durée de conservation</h2>
              <p className="mb-4">
                Les cookies sont conservés pour différentes durées selon leur type :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Cookies de session :</strong> supprimés à la fermeture du navigateur</li>
                <li><strong>Cookies persistants :</strong> conservés jusqu'à 13 mois maximum</li>
                <li><strong>Cookies tiers :</strong> selon les politiques des partenaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Gestion de vos préférences</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Paramétrage de votre navigateur</h3>
              <p className="mb-4">
                Vous pouvez configurer votre navigateur pour :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Accepter ou refuser les cookies</li>
                <li>Être averti avant l'acceptation des cookies</li>
                <li>Supprimer les cookies existants</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Instructions par navigateur</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies et autres données de sites</p>
                <p><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies et données de sites</p>
                <p><strong>Safari :</strong> Préférences → Confidentialité → Cookies et données de sites web</p>
                <p><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Outils de gestion</h3>
              <p className="mb-4">
                Vous pouvez également utiliser des outils en ligne pour gérer vos préférences :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><a href="https://www.youronlinechoices.eu" className="text-blue-600 hover:underline">www.youronlinechoices.eu</a></li>
                <li><a href="https://optout.networkadvertising.org" className="text-blue-600 hover:underline">optout.networkadvertising.org</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Conséquences du refus des cookies</h2>
              <p className="mb-4">
                Le refus de certains cookies peut limiter votre expérience sur notre site :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Impossibilité de mémoriser vos préférences</li>
                <li>Fonctionnalités limitées</li>
                <li>Expérience moins personnalisée</li>
                <li>Nécessité de ressaisir certaines informations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Mise à jour de cette politique</h2>
              <p className="mb-4">
                Cette politique de cookies peut être mise à jour pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.
              </p>
              <p className="mb-4">
                Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant notre utilisation des cookies, contactez-nous :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Email :</strong> info@total-fioul.fr</p>
                <p><strong>Adresse :</strong> Total Pacifique Sàrl, 5 rue Michel-Ange, 75016 Paris</p>
              </div>
            </section>

            <p className="text-sm text-gray-600 mt-8">
              Politique de cookies mise à jour le 1er janvier 2024.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolitiqueCookies;
