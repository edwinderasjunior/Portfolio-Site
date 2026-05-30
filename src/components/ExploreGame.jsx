import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AntigravityBackground from './AntigravityBackground';

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'transparent',
    color: '#1f1f1f',
    fontFamily: "'Inter', 'Google Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'hidden',
    pointerEvents: 'auto',
  },
  backBtn: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    color: '#1f1f1f',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  header: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1f1f1f',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  navLink: {
    color: '#5f6368',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  tryFreeBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'background-color 0.2s',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 24px 40px 24px',
    width: '100%',
    maxWidth: '1200px',
  },
  heroTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  cursorLine: {
    width: '2px',
    height: '36px',
    backgroundColor: '#1f1f1f',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: '#1f1f1f',
    margin: 0,
  },
  subtitleContainer: {
    textAlign: 'center',
    marginBottom: '24px',
    maxWidth: '600px',
  },
  subtitleLine: {
    fontSize: '0.95rem',
    color: '#5f6368',
    lineHeight: 1.5,
    margin: '2px 0',
  },
  downloadBtn: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '24px',
    padding: '10px 24px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '40px',
    transition: 'background-color 0.2s',
  },
  heroCard: {
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#000000',
    borderRadius: '24px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    marginBottom: '80px',
  },
  stackedLogoFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
    backgroundColor: '#000000',
  },
  stackedText: {
    fontSize: '7rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#ffffff',
    lineHeight: 0.8,
    margin: 0,
    opacity: 0.95,
  },
  stackedTextDim: {
    fontSize: '7rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#ffffff',
    lineHeight: 0.8,
    margin: 0,
    opacity: 0.4,
  },
  featuresSection: {
    width: '100%',
    maxWidth: '1000px',
    padding: '0 24px',
    marginBottom: '80px',
  },
  sectionHeading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1f1f1f',
    marginBottom: '40px',
    textAlign: 'left',
  },
  standaloneCard: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    marginBottom: '32px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
  },
  standaloneImage: {
    width: '100%',
    height: 'auto',
  },
  standaloneFallback: {
    width: '100%',
    height: '360px',
    backgroundColor: '#f1f3f4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  mockHubWindow: {
    width: '90%',
    maxWidth: '640px',
    height: '280px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06)',
    padding: '20px',
    display: 'flex',
    gap: '20px',
  },
  mockSidebar: {
    width: '140px',
    height: '100%',
    borderRight: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '12px',
  },
  mockSidebarItem: {
    height: '16px',
    backgroundColor: '#f1f3f4',
    borderRadius: '4px',
    width: '100%',
  },
  mockWorkspace: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mockWorkspaceBar: {
    height: '32px',
    backgroundColor: '#f1f3f4',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    fontSize: '0.75rem',
    color: '#5f6368',
  },
  standaloneTextContainer: {
    padding: '24px',
    textAlign: 'left',
  },
  featureCardTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#1f1f1f',
    marginBottom: '8px',
  },
  featureCardDesc: {
    fontSize: '0.85rem',
    color: '#5f6368',
    lineHeight: 1.5,
    margin: 0,
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
    gap: '32px',
    marginBottom: '32px',
  },
  featureColCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
  },
  colImageFallback: {
    width: '100%',
    height: '240px',
    backgroundColor: '#f1f3f4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  mockPanel: {
    width: '80%',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  mockSettingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockToggle: {
    width: '28px',
    height: '16px',
    borderRadius: '8px',
    backgroundColor: '#4285f4',
  },
  colTextContainer: {
    padding: '20px 24px 24px 24px',
    textAlign: 'left',
  },
  darkColImageFallback: {
    width: '100%',
    height: '240px',
    backgroundColor: '#0a0d14',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    position: 'relative',
  },
  mockFlowchart: {
    width: '75%',
    height: '160px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#121620',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.75rem',
    color: '#8b949e',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    marginTop: '60px',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    paddingTop: '60px',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  infoIcon: {
    fontSize: '1.5rem',
  },
  infoTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1f1f1f',
  },
  infoText: {
    fontSize: '0.85rem',
    color: '#5f6368',
    lineHeight: 1.5,
    margin: 0,
  },
  downloadBanner: {
    width: '95%',
    maxWidth: '1000px',
    backgroundColor: '#000000',
    borderRadius: '28px',
    padding: '60px 80px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
    marginBottom: '80px',
  },
  bannerLeft: {
    flex: '1.2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    color: '#ffffff',
    marginBottom: '28px',
  },
  bannerActions: {
    display: 'flex',
    gap: '12px',
  },
  bannerBtnPrimary: {
    padding: '12px 24px',
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
  bannerBtnSecondary: {
    padding: '12px 24px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
  bannerRight: {
    flex: '0.8',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  mockStars: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(66, 133, 244, 0.15) 0%, transparent 70%)',
    opacity: 0.8,
  },
  footer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    padding: '60px 24px 40px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerContent: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '80px',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
  footerLogo: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1f1f1f',
  },
  footerCopyright: {
    fontSize: '0.75rem',
    color: '#9cc3e6', // custom copyright color
  },
  footerLinksGrid: {
    display: 'flex',
    gap: '64px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  footerColTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#1f1f1f',
    marginBottom: '4px',
  },
  footerLink: {
    fontSize: '0.8rem',
    color: '#5f6368',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  footerMassiveText: {
    fontSize: '9.5rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#000000',
    lineHeight: 0.8,
    margin: '40px 0 20px 0',
    textAlign: 'center',
    width: '100%',
    opacity: 0.95,
  },
  showcaseImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

function ExploreGame() {
  const [heroImgErr, setHeroImgErr] = useState(false);
  const [hubImgErr, setHubImgErr] = useState(false);
  const [orchImgErr, setOrchImgErr] = useState(false);
  const [subImgErr, setSubImgErr] = useState(false);
  const [artImgErr, setArtImgErr] = useState(false);
  const [cronImgErr, setCronImgErr] = useState(false);

  return (
    <div style={styles.container}>
      <AntigravityBackground />
      {/* Pill-shaped Back Button on Left */}
      <Link
        to="/"
        style={styles.backBtn}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
        }}
      >
        Back to Portfolio
      </Link>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroTitleWrapper}>
          <div style={styles.cursorLine} />
          <h1 style={styles.heroTitle}>FlappyMC</h1>
        </div>

        <div style={styles.subtitleContainer}>
          <p style={styles.subtitleLine}>
            Google Antigravity 2.0 is your dedicated platform to work with agents.
          </p>
          <p style={styles.subtitleLine}>
            Orchestrate multiple autonomous agents working in parallel across
            independent projects.
          </p>
        </div>

        <button
          type="button"
          style={styles.downloadBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }}
        >
          Download
        </button>

        {/* Massive Stacked Title Showcase */}
        <div style={styles.heroCard}>
          {!heroImgErr ? (
            <img
              src="images/projects/antigravity-hero.png"
              alt="Antigravity 2.0 Hero"
              style={styles.showcaseImage}
              onError={() => setHeroImgErr(true)}
            />
          ) : (
            <div style={styles.stackedLogoFallback}>
              <h2 style={styles.stackedText}>Antigravity</h2>
              <h2 style={styles.stackedText}>Antigravity</h2>
              <h2 style={styles.stackedText}>Antigravity</h2>
              <h2 style={styles.stackedTextDim}>Antigravity</h2>
            </div>
          )}
        </div>
      </section>

      {/* Main Features Grid */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionHeading}>Explore the main features</h2>

        {/* Feature 1: Standalone Hub */}
        <div style={styles.standaloneCard}>
          {!hubImgErr ? (
            <img
              src="images/projects/standalone-hub.png"
              alt="Standalone Hub"
              style={styles.standaloneImage}
              onError={() => setHubImgErr(true)}
            />
          ) : (
            <div style={styles.standaloneFallback}>
              <div style={styles.mockHubWindow}>
                <div style={styles.mockSidebar}>
                  <div style={styles.mockSidebarItem} />
                  <div style={styles.mockSidebarItem} />
                  <div style={styles.mockSidebarItem} />
                </div>
                <div style={styles.mockWorkspace}>
                  <div style={styles.mockWorkspaceBar}>
                    Workspace: Central-work-system
                  </div>
                  <div style={styles.mockSidebarItem} />
                  <div style={styles.mockSidebarItem} />
                </div>
              </div>
            </div>
          )}
          <div style={styles.standaloneTextContainer}>
            <h3 style={styles.featureCardTitle}>Standalone Hub</h3>
            <p style={styles.featureCardDesc}>
              The agentic development desktop command center. Manage agents,
              independent of your code editor.
            </p>
          </div>
        </div>

        {/* Row 2: Manage & Orchestrate AND Dynamic Subagents */}
        <div style={styles.twoColGrid}>
          {/* Manage & Orchestrate */}
          <div style={styles.featureColCard}>
            {!orchImgErr ? (
              <img
                src="images/projects/manage-orchestrate.png"
                alt="Manage & Orchestrate"
                style={styles.standaloneImage}
                onError={() => setOrchImgErr(true)}
              />
            ) : (
              <div style={styles.colImageFallback}>
                <div style={styles.mockPanel}>
                  <div style={styles.mockSidebarItem} />
                  <div style={styles.mockSidebarItem} />
                </div>
              </div>
            )}
            <div style={styles.colTextContainer}>
              <h3 style={styles.featureCardTitle}>Manage & Orchestrate</h3>
              <p style={styles.featureCardDesc}>
                Spin up, monitor, and coordinate multiple autonomous agents to
                handle complex parallel pipelines.
              </p>
            </div>
          </div>

          {/* Dynamic Subagents */}
          <div style={styles.featureColCard}>
            {!subImgErr ? (
              <img
                src="images/projects/dynamic-subagents.png"
                alt="Dynamic Subagents"
                style={styles.standaloneImage}
                onError={() => setSubImgErr(true)}
              />
            ) : (
              <div style={styles.colImageFallback}>
                <div style={styles.mockPanel}>
                  <div style={styles.mockSettingsRow}>
                    <span style={{ fontSize: '0.8rem' }}>Subagent active</span>
                    <div style={styles.mockToggle} />
                  </div>
                  <div style={styles.mockSettingsRow}>
                    <span style={{ fontSize: '0.8rem' }}>Parallelize threads</span>
                    <div style={styles.mockToggle} />
                  </div>
                </div>
              </div>
            )}
            <div style={styles.colTextContainer}>
              <h3 style={styles.featureCardTitle}>Dynamic subagents</h3>
              <p style={styles.featureCardDesc}>
                Assign focused subtasks to subagents in real-time, keeping
                context windows clean and context dense.
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Artifacts AND Cron & Customization */}
        <div style={styles.twoColGrid}>
          {/* Artifacts */}
          <div style={styles.featureColCard}>
            {!artImgErr ? (
              <img
                src="images/projects/artifacts.png"
                alt="Artifacts"
                style={styles.standaloneImage}
                onError={() => setArtImgErr(true)}
              />
            ) : (
              <div style={styles.darkColImageFallback}>
                <div style={styles.mockFlowchart}>
                  <span>[Task Plan]</span>
                  <span>- Verify installation files</span>
                  <span>- Build bundle package</span>
                </div>
              </div>
            )}
            <div style={styles.colTextContainer}>
              <h3 style={styles.featureCardTitle}>Artifacts</h3>
              <p style={styles.featureCardDesc}>
                Deliverables like code, logs, and diff files are automatically
                generated for asynchronous human review.
              </p>
            </div>
          </div>

          {/* Cron & Customization */}
          <div style={styles.featureColCard}>
            {!cronImgErr ? (
              <img
                src="images/projects/cron-customization.png"
                alt="Cron & Customization"
                style={styles.standaloneImage}
                onError={() => setCronImgErr(true)}
              />
            ) : (
              <div style={styles.colImageFallback}>
                <div style={styles.mockPanel}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    0 * * * * - Trigger background lint check
                  </div>
                </div>
              </div>
            )}
            <div style={styles.colTextContainer}>
              <h3 style={styles.featureCardTitle}>Cron & Customization</h3>
              <p style={styles.featureCardDesc}>
                Automate dynamic tasks, set background crons, and customize
                agent skills with local hooks.
              </p>
            </div>
          </div>
        </div>

        {/* Summarized Icon Columns */}
        <div style={styles.infoGrid}>
          <div style={styles.infoCol}>
            <div style={styles.infoIcon}>📂</div>
            <h4 style={styles.infoTitle}>Projects</h4>
            <p style={styles.infoText}>
              Manage isolated workspaces, projects, or local directories.
            </p>
          </div>
          <div style={styles.infoCol}>
            <div style={styles.infoIcon}>👥</div>
            <h4 style={styles.infoTitle}>Parallel Workspaces</h4>
            <p style={styles.infoText}>
              Coordinate multiple agents working in parallel on different
              directories at once.
            </p>
          </div>
          <div style={styles.infoCol}>
            <div style={styles.infoIcon}>⚙️</div>
            <h4 style={styles.infoTitle}>Skill Customization</h4>
            <p style={styles.infoText}>
              Write custom prompts and integrate external MCPs to extend what
              your agent is capable of.
            </p>
          </div>
        </div>
      </section>

      {/* Download Banner */}
      <div style={styles.downloadBanner}>
        <div style={styles.bannerLeft}>
          <h2 style={styles.bannerTitle}>
            Download Google
            <br />
            Antigravity for
            <br />
            Windows
          </h2>
          <div style={styles.bannerActions}>
            <span style={styles.bannerBtnPrimary}>Download for Windows</span>
            <span style={styles.bannerBtnSecondary}>Explore the CLI & SDK</span>
          </div>
        </div>
        <div style={styles.bannerRight}>
          {/* Constellation Glow Effect */}
          <div style={styles.mockStars} />
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>Google Antigravity</span>
          </div>
          <div style={styles.footerLinksGrid}>
            <div style={styles.footerCol}>
              <span style={styles.footerColTitle}>Company</span>
              <span style={styles.footerLink}>About Us</span>
              <span style={styles.footerLink}>Careers</span>
              <span style={styles.footerLink}>Status</span>
              <span style={styles.footerLink}>Changelog</span>
            </div>
            <div style={styles.footerCol}>
              <span style={styles.footerColTitle}>Resources</span>
              <span style={styles.footerLink}>Blog</span>
              <span style={styles.footerLink}>Guides</span>
              <span style={styles.footerLink}>Feedback</span>
            </div>
          </div>
        </div>

        {/* Massive Bottom Text */}
        <h1 style={styles.footerMassiveText}>Antigravity</h1>
      </footer>
    </div>
  );
}

export default ExploreGame;
