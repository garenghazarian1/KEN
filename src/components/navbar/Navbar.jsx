import Logo from "@/components/navbar/logo/page";
import Link from "next/link";
import Links from "./links/Links";
import styles from "./Navbar.module.css";
import { BOOKING_URL } from "@/config/constants";

export default function Navbar() {
  return (
    <>
      <div className={styles.navbar}>
        <div>
          <Link href="/">
            {" "}
            <Logo />
          </Link>
        </div>
        <div>
          {/* <Link href="/stores">
            <span className={styles.button}>Book Now</span>
          </Link> */}
          <Link href={BOOKING_URL}>
            <span className={styles.button}>Book Now</span>
          </Link>
        </div>
        <div>
          <Links />
        </div>
      </div>
    </>
  );
}
