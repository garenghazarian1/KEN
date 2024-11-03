"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NavLink from "./navLink/navLink";
import HamburgerButton from "../HamburgerButton/HamburgerButton";

import Image from "next/image";
import styles from "./Links.module.css";

export default function Links() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const Links = [
    { title: "Home", path: "/" },
    {
      title: "Book",
      path: "./logo03.png",
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
            {Links.map((link) => (
              <NavLink item={link} key={link.title} onClick={closeMenu} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
