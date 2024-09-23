"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.css"

const NavLink = ({ item, onClick }) => {
  const pathName = usePathname();

  return (
    <Link
    href={item.path}
    onClick={onClick}
    className={`${styles.linkBase} ${pathName === item.path ? styles.activeLink : styles.inactiveLink}`}
  >
    {item.title}
  </Link>
  );
};

export default NavLink;
