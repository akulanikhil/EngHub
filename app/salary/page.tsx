import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SalaryExplorer from '@/components/SalaryExplorer'

export const metadata = {
  title: 'Salary Explorer — EngyNation',
  description: 'Browse real salary data submitted by engineers across every discipline. See what your peers are making.',
}

export default function SalaryPage() {
  return (
    <>
      <Navbar />
      <main>
        <SalaryExplorer />
      </main>
      <Footer />
    </>
  )
}
