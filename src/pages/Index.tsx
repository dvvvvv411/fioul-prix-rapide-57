
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PriceTrends from '@/components/PriceTrends';
import Benefits from '@/components/Benefits';
import Advantages from '@/components/Advantages';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <PriceTrends />
      <Benefits />
      <Advantages />
      <Testimonials />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
