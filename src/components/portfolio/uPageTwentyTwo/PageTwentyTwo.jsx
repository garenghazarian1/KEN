import styles from "./PageTwentyTwo.module.css";
import { inter, bad } from "@/app/ui/fonts";
import Image from "next/image";

export default function PageTwentyTwo() {
  return (
    <div className={styles.containerD}>
      <div className={styles.leftPaneD}>
        <Image
          src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124214/logo01_kyphyv.png"
          alt="K Logo"
          className={styles.imageD}
          width={250}
          height={250}
        />
      </div>

      <div id="Celebrities" className={styles.rightPaneD}>
        <p className={`${inter.className} ${styles.textNumDA}`}>10</p>
        <p className={`${inter.className} ${styles.textNumDB}`}>Celebrities</p>
        <p className={`${styles.textNumDC} ${bad.className}`}>We work with</p>
      </div>
    </div>
  );
}
