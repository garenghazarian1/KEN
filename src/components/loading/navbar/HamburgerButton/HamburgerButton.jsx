import styles from "./HamburgerButton.modern.module.css";

const HamburgerButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className={`${styles.hamburgerBtn} ${isOpen ? styles.isOpen : ""}`}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-menu"
    >
      <div className={`${styles.line} ${styles.lineTop}`}></div>
      <div className={`${styles.line} ${styles.lineMiddle}`}></div>
      <div className={`${styles.line} ${styles.lineBottom}`}></div>
    </button>
  );
};

export default HamburgerButton;
