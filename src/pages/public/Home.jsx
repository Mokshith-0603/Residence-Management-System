export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero hero-bg">
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Welcome to Our Community</h1>
          <p>
            A modern, secure, and professional residence management platform
            designed for seamless community operations.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section">
        <h2>About the Community</h2>
        <p>
          Our community is built around comfort, security, and a strong sense of belonging. Designed to support modern living, it offers well-planned residences, thoughtfully curated amenities, and a safe environment for families and individuals alike.

Through our Residence Management System, residents and administrators stay seamlessly connected—ensuring transparency, efficient communication, and smooth day-to-day operations. From property listings and resident information to issue reporting and community updates, everything is managed in one unified platform.
        </p>
      </section>
      

<section className="section">
  <h2 className="section-title">Community Highlights</h2>

  <div className="highlights-grid">
    <div className="highlight-card">
      <div className="highlight-icon">🏊</div>
      <h4>Swimming Pool</h4>
      <p>Olympic-sized pool with dedicated lanes</p>
    </div>

    <div className="highlight-card">
      <div className="highlight-icon">🏋️</div>
      <h4>Fitness Center</h4>
      <p>State-of-the-art gym equipment</p>
    </div>

    <div className="highlight-card">
      <div className="highlight-icon">🌳</div>
      <h4>Green Spaces</h4>
      <p>Beautiful parks and landscaped gardens</p>
    </div>

    <div className="highlight-card">
      <div className="highlight-icon">🔒</div>
      <h4>24/7 Security</h4>
      <p>Professional security personnel</p>
    </div>
  </div>
</section>

    </>
  );
}
