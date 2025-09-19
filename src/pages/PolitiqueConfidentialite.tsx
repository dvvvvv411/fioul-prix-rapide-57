import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Responsable du traitement</h2>
              <p className="mb-4">
                Total Pacifique Sàrl, société à responsabilité limitée au capital de 10 000 €, dont le siège social est situé 5 rue Michel-Ange, 75016 Paris, France, immatriculée au RCS de Paris sous le numéro 775744998, est responsable du traitement de vos données personnelles.
              </p>
              <p className="mb-4">
                <strong>Contact :</strong> info@total-fioul.fr
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Données collectées</h2>
              <p className="mb-4">
                Nous collectons les données suivantes :
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Données d'identification :</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse postale</li>
                <li>Numéro de téléphone</li>
                <li>Adresse email</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Données de commande :</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Historique des commandes</li>
                <li>Préférences de livraison</li>
                <li>Informations de paiement (cryptées)</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Données de navigation :</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Adresse IP</li>
                <li>Données de connexion</li>
                <li>Cookies et traceurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Finalités du traitement</h2>
              <p className="mb-4">
                Vos données sont traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Gestion des commandes :</strong> traitement et suivi de vos commandes de fioul</li>
                <li><strong>Livraison :</strong> organisation et réalisation des livraisons</li>
                <li><strong>Facturation :</strong> établissement et suivi des factures</li>
                <li><strong>Service client :</strong> réponse à vos demandes et réclamations</li>
                <li><strong>Marketing :</strong> envoi d'offres commerciales (avec votre consentement)</li>
                <li><strong>Amélioration du service :</strong> analyse statistique et amélioration de nos services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Base légale</h2>
              <p className="mb-4">
                Le traitement de vos données repose sur :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Exécution du contrat :</strong> pour la gestion de vos commandes et livraisons</li>
                <li><strong>Obligation légale :</strong> pour la facturation et la comptabilité</li>
                <li><strong>Intérêt légitime :</strong> pour l'amélioration de nos services</li>
                <li><strong>Consentement :</strong> pour les communications marketing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Destinataires des données</h2>
              <p className="mb-4">
                Vos données peuvent être transmises à :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Nos partenaires de livraison</li>
                <li>Nos prestataires de paiement</li>
                <li>Nos sous-traitants informatiques</li>
                <li>Les autorités compétentes en cas d'obligation légale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Durée de conservation</h2>
              <p className="mb-4">
                Nous conservons vos données :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Données de commande :</strong> 10 ans (obligation comptable)</li>
                <li><strong>Données marketing :</strong> 3 ans après le dernier contact</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Vos droits</h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> supprimer vos données dans certains cas</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement pour motif légitime</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement dans certains cas</li>
              </ul>
              <p className="mb-4">
                Pour exercer vos droits, contactez-nous à : info@total-fioul.fr
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Sécurité</h2>
              <p className="mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Cookies</h2>
              <p className="mb-4">
                Notre site utilise des cookies pour améliorer votre expérience de navigation. Pour plus d'informations, consultez notre <a href="/politique-cookies" className="text-blue-600 hover:underline">Politique de cookies</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact et réclamations</h2>
              <p className="mb-4">
                Pour toute question relative à cette politique de confidentialité, contactez-nous à :
              </p>
              <p className="mb-4">
                <strong>Email :</strong> info@total-fioul.fr<br/>
                <strong>Courrier :</strong> Total Pacifique Sàrl, 5 rue Michel-Ange, 75016 Paris
              </p>
              <p className="mb-4">
                Vous avez également le droit d'introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">www.cnil.fr</a>
              </p>
            </section>

            <p className="text-sm text-gray-600 mt-8">
              Politique de confidentialité mise à jour le 1er janvier 2024.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
