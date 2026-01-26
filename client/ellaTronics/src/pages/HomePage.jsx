
import AboutUsSimple from '../components/About'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import LatestProducts from '../components/LatestProducts'
import Testimonial from '../components/Testimonial'
import WhyChooseUs from '../components/WhyChooseUs'
import ProductList from './ProductList'
const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <ProductList />
      <LatestProducts />
      <AboutUsSimple />
      <Testimonial />
      <WhyChooseUs />
      <Footer />
    </>
  )
}

export default HomePage