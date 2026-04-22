export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <a href="#" className="footer-logo">
              <div className="footer-logo-mark">⚙️</div>
              Eng<span>Hub</span>
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
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Careers</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 EngHub. All rights reserved.</div>
          <div className="footer-made">Built with ❤️ at the University of Kentucky</div>
        </div>
      </div>
    </footer>
  )
}
