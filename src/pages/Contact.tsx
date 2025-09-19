
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactHero from '@/components/ContactHero';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ContactHero />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Contact;
