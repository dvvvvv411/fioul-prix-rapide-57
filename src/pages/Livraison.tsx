
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DeliveryHero from '@/components/DeliveryHero';
import DeliveryBenefits from '@/components/DeliveryBenefits';
import DeliveryProcess from '@/components/DeliveryProcess';

const Livraison = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <DeliveryHero />
      <DeliveryBenefits />
      <DeliveryProcess />
      <Footer />
    </div>
  );
};

export default Livraison;
