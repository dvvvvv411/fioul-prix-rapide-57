import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informations sur l'éditeur</h2>
              <p className="mb-4">
                Le présent site web est édité par :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p><strong>Raison sociale :</strong> Total Pacifique Sàrl</p>
                <p><strong>Forme juridique :</strong> Société à responsabilité limitée (SARL)</p>
                <p><strong>Capital social :</strong> 10 000 €</p>
                <p><strong>Siège social :</strong> 5 rue Michel-Ange, 75016 Paris, France</p>
                <p><strong>Directeur de la publication :</strong> Patrick Pouyanné</p>
                <p><strong>SIREN :</strong> 775744998</p>
                <p><strong>SIRET :</strong> 77574499800037</p>
                <p><strong>N° TVA intracommunautaire :</strong> FR64521322993</p>
                <p><strong>Email :</strong> info@total-fioul.fr</p>
                <p><strong>Site web :</strong> <a href="https://total-fioul.fr" className="text-blue-600 hover:underline">https://total-fioul.fr</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hébergement</h2>
              <p className="mb-4">
                Le site est hébergé par un prestataire technique externe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Propriété intellectuelle</h2>
              <p className="mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="mb-4">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Responsabilité</h2>
              <p className="mb-4">
                Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>
              <p className="mb-4">
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email, à l'adresse info@total-fioul.fr, en décrivant le problème de la manière la plus précise possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Liens hypertextes</h2>
              <p className="mb-4">
                Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de Total Pacifique Sàrl.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Données personnelles</h2>
              <p className="mb-4">
                De manière générale, vous n'êtes pas tenu de nous communiquer vos données personnelles lorsque vous visitez notre site Internet.
              </p>
              <p className="mb-4">
                Cependant, ce principe comporte certaines exceptions. En effet, pour certains services proposés par notre site, vous pouvez être amenés à nous communiquer certaines données telles que : votre nom, votre fonction, le nom de votre société, votre adresse électronique, et votre numéro de téléphone.
              </p>
              <p className="mb-4">
                Pour plus d'informations sur le traitement de vos données personnelles, consultez notre <a href="/politique-confidentialite" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Droit applicable et juridiction compétente</h2>
              <p className="mb-4">
                Tout litige en relation avec l'utilisation du site https://total-fioul.fr est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
