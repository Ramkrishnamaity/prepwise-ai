import Navbar from '@/components/home/Navbar'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Footer from '@/components/home/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  )
}
