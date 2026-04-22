import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Demo from '@/components/Demo'
import Features from '@/components/Features'
import Majors from '@/components/Majors'
import HowItWorks from '@/components/HowItWorks'
import About from '@/components/About'
import Contact from '@/components/Contact'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="divider"></div>
        <Demo />
        <div className="divider"></div>
        <Features />
        <div className="divider"></div>
        <Majors />
        <div className="divider"></div>
        <HowItWorks />
        <div className="divider"></div>
        <About />
        <div className="divider"></div>
        <Contact />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
