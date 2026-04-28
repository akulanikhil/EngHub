import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Majors from '@/components/Majors'
import About from '@/components/About'
import Contact from '@/components/Contact'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Majors />
        <About />
        <Contact />
      </main>
    </>
  )
}
