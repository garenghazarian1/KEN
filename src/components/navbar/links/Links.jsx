"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NavLink from "./navLink/navLink";
import HamburgerButton from "../HamburgerButton/HamburgerButton";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import styles from "./Links.module.css";

export default function Links() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const Links = [
    { title: "Home", path: "/" },
    {
      title: "Book",
      path: "https://kenbeauty.zenoti.com/webstoreNew/services",
    },
    { title: "About Us", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "Gallery", path: "/gallery" },
  ];

  // CLICK OUTSIDE MENU TO CLOSE MENU
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-btn")
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Function to close the menu
  const closeMenu = () => {
    setOpen(false);
  };

  //LOGOUT *******************************************
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      // No need to manually route to '/' since NextAuth will handle this based on your configuration
    } catch (error) {
      console.error(error, "Logout error:");
    }
  };

  return (
    <>
      <div className={styles.container}>
        {Links.map((link) => (
          <NavLink item={link} key={link.title} />
        ))}
        {/* {session ? (
          <Link href="/user">
            <div className={styles.imageContainer}>
              <Image
                src={session?.user?.image}
                alt="Profile"
                as="image"
                width={50}
                height={50}
                priority
                className={styles.image}
              />
              <h2>Welcome {session?.user?.name}</h2>
              <button onClick={handleLogout} className={styles.button}>
                Logout
              </button>
            </div>
          </Link>
        ) : (
          <>
            <Link href="/login" className={styles.button}>
              Login
            </Link>
            <Link href="/register" className={styles.button}>
              Register
            </Link>
          </>
        )} */}
      </div>

      {/* Toggle button for smaller screens */}
      <div className={styles.toggleContainer}>
        <div className={styles.hamburgerContainer}>
          <HamburgerButton
            isOpen={open}
            toggle={() => setOpen((prevOpen) => !prevOpen)}
          />
        </div>
        {open && (
          <div ref={menuRef} className={styles.menuContainer}>
            {/* {session ? (
              <>
                <Link href="/user" onClick={closeMenu}>
                  <Image
                    src={session?.user?.image}
                    alt="Profile"
                    width={50}
                    height={50}
                    priority
                    className={styles.image}
                  />
                </Link>
                <button onClick={handleLogout} className={styles.button}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={styles.button}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={styles.button}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )} */}
            {Links.map((link) => (
              <NavLink item={link} key={link.title} onClick={closeMenu} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
