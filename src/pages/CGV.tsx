import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CGV = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 1 - Objet</h2>
              <p className="mb-4">
                Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les ventes de fioul domestique effectuées par Total Pacifique Sàrl auprès de particuliers et professionnels sur le territoire français.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 2 - Prix</h2>
              <p className="mb-4">
                Les prix sont indiqués en euros toutes taxes comprises (TTC). Ils incluent la TVA au taux en vigueur à la date de la commande.
              </p>
              <p className="mb-4">
                Les prix peuvent être modifiés à tout moment sans préavis. Le prix applicable est celui en vigueur au moment de la validation de la commande.
              </p>
              <p className="mb-4">
                La livraison est gratuite pour toute commande de 2000 litres minimum. Pour les commandes inférieures, des frais de livraison s'appliquent selon le barème en vigueur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 3 - Commande</h2>
              <p className="mb-4">
                La commande peut être passée :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Par email à info@total-fioul.fr</li>
                <li>Via le formulaire de contact sur notre site web</li>
              </ul>
              <p className="mb-4">
                Toute commande implique l'acceptation pleine et entière des présentes conditions générales de vente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 4 - Livraison</h2>
              <p className="mb-4">
                Les délais de livraison annoncés sont donnés à titre indicatif. Un retard de livraison ne peut donner lieu à des dommages et intérêts.
              </p>
              <p className="mb-4">
                La livraison s'effectue à l'adresse indiquée par le client lors de la commande. Il appartient au client de vérifier l'accessibilité des lieux et la conformité de son installation.
              </p>
              <p className="mb-4">
                Le client doit être présent lors de la livraison pour réceptionner sa commande et signer le bon de livraison.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 5 - Paiement</h2>
              <p className="mb-4">
                Le paiement s'effectue :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>À la livraison par chèque, espèces ou carte bancaire</li>
                <li>Par virement bancaire avant livraison</li>
                <li>Par prélèvement automatique pour les clients réguliers</li>
              </ul>
              <p className="mb-4">
                En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux d'intérêt légal seront appliquées.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 6 - Qualité du produit</h2>
              <p className="mb-4">
                Total Pacifique Sàrl s'engage à livrer un fioul domestique conforme aux normes en vigueur (NF EN 14214 pour le biodiesel et NF M15-011 pour le fioul domestique).
              </p>
              <p className="mb-4">
                Toute réclamation concernant la qualité du produit doit être formulée dans les 8 jours suivant la livraison.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 7 - Responsabilité</h2>
              <p className="mb-4">
                La responsabilité de Total Pacifique Sàrl ne peut être engagée en cas de :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Force majeure ou cas fortuit</li>
                <li>Mauvaise utilisation du produit par le client</li>
                <li>Non-conformité de l'installation du client</li>
                <li>Défaut d'entretien de l'installation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 8 - Droit de rétractation</h2>
              <p className="mb-4">
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés.
              </p>
              <p className="mb-4">
                Le fioul étant un produit énergétique livré et consommé immédiatement, aucun droit de rétractation ne peut s'exercer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 9 - Règlement des litiges</h2>
              <p className="mb-4">
                En cas de litige, le client peut recourir à la médiation de la consommation auprès du médiateur de l'énergie.
              </p>
              <p className="mb-4">
                À défaut de règlement amiable, tout litige sera soumis aux tribunaux compétents de Paris.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 10 - Données personnelles</h2>
              <p className="mb-4">
                Les données personnelles collectées sont traitées conformément à notre <a href="/politique-confidentialite" className="text-blue-600 hover:underline">Politique de confidentialité</a> et à la réglementation en vigueur.
              </p>
            </section>

            <p className="text-sm text-gray-600 mt-8">
              Conditions générales de vente en vigueur au 1er janvier 2024.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGV;
