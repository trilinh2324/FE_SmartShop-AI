import Header from '../components/home/Header';
import Navigation from '../components/home/Navigation';
import Breadcrumb from '../components/home/Breadcrumb';
import ProductSection from '../components/home/ProductSection';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <Navigation />
      <Breadcrumb />
      <ProductSection />
      <Footer />
    </div>
  );
}