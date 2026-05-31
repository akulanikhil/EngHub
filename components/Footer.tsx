import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <a href="#" className="footer-logo">
              <div className="footer-logo-mark">
                <Image src="/images/logo.png" alt="EngynNation" width={22} height={22} style={{ objectFit: 'contain' }} />
              </div>
              Engyn<span>Nation</span>
            </a>
            <p className="footer-tagline">The career community built for every engineering major. Discuss salaries, share advice, get AI guidance.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#features" className="footer-link">Features</a>
            <a href="#majors" className="footer-link">Majors</a>
            <a href="/forum" className="footer-link">Forum</a>
            <a href="#" className="footer-link">Join Free</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about" className="footer-link">About Us</a>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <a href="mailto:nikhil.akula@uky.edu" className="footer-link">🎓 University Partnerships</a>
            <a href="mailto:mohammad.nj@uky.edu" className="footer-link">📧 General Inquiries</a>
            <a href="mailto:mohammad.nj@uky.edu" className="footer-link">💼 Investors</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 EngynNation. All rights reserved.</div>
          <div className="footer-made">Built with ❤️ at the University of Kentucky</div>
        </div>
      </div>
    </footer>
  )
}
