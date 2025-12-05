//import styles from './HamburgerButton.module.css';

const HamburgerButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="hamburger-btn lg:hidden fixed top-4 right-8 z-50 flex flex-col justify-center items-center w-12 h-12 rounded-md bg-transparent  border border-transparent hover:border-teal-950 "
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-menu"
    >
      {/* green-200
      bg-green-100
      bg-green-200
      bg-green-300 */}
      <div
        className={`w-8 h-0.5 bg-customBrown-light mb-2 transition-transform duration-300 ease-in-out ${
          isOpen ? "rotate-45 translate-y-3.5" : ""
        }`}
      ></div>
      <div
        className={`w-8 h-0.5 bg-customBrown transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-0" : ""
        }`}
      ></div>
      <div
        className={`w-8 h-0.5 bg-customBrown-dark mt-2 transition-transform duration-300 ease-in-out ${
          isOpen ? "-rotate-45 -translate-y-3.5" : ""
        }`}
      ></div>
    </button>
  );
};

export default HamburgerButton;
