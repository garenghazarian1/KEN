import Logo from "@/components/navbar/logo/page";
import Link from "next/link";
import Links from "./links/Links";
import styles from "./Navbar.module.css";

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
          <Link href="https://kenbeauty.zenoti.com/webstoreNew/services">
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
