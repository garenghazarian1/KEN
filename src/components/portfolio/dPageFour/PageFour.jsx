"use client";
import Image from "next/image";
import styles from "./PageFour.module.css";
import { inter, bad } from "@/app/ui/fonts";

export default function PageFour() {
  return (
    <>
      {/* PAGE04  */}

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
        <div id="whoWeAre" className={styles.rightPaneD}>
          <p className={`${inter.className} ${styles.textNumDA}`}>01</p>
          <p className={`${inter.className} ${styles.textNumDB}`}>Who</p>
          <p className={`${styles.textNumDC} ${bad.className}`}>we are</p>
        </div>
      </div>
    </>
  );
}
