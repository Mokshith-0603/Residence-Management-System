export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* ABOUT */}
        <div className="footer-column">
          <h4>About Residence</h4>
          <p>
            Your premium residential community management platform, designed
            to simplify administration and enhance resident experience through
            secure and modern digital solutions.
          </p>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li>Email: admin@residence.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Community Lane, City, India</li>
          </ul>
        </div>

        {/* QUERY FORM */}
        <div className="footer-column">
          <h4>Send Query</h4>
          <form className="footer-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="3" required />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Residence Management System. All rights reserved.
      </div>
    </footer>
  );
}
