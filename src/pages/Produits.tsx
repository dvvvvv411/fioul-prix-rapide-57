
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductHero from '@/components/ProductHero';
import ProductComparison from '@/components/ProductComparison';
import ProductQuality from '@/components/ProductQuality';

const Produits = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ProductHero />
      <ProductComparison />
      <ProductQuality />
      <Footer />
    </div>
  );
};

export default Produits;
