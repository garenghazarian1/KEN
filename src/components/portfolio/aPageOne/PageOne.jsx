"use client";
import Image from "next/image";
import styles from "./PageOne.module.css";

export default function PageOne() {
  return (
    <>
      {/* PAGE01 */}
      <div className={styles.containerA}>
        <div className={styles.leftPaneA}>
          <Image
            src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124214/logo01_kyphyv.png"
            alt="Ken Salon Portfolio"
            width={350}
            height={350}
            className={styles.imageA}
          />
          <div className={styles.portfolioTextA}>PORTFOLIO</div>
        </div>
        <div className={styles.rightPaneA}>
          <Image
            src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727098802/ken_cdbcuy.jpg"
            alt="Ken Salon Portfolio"
            width={500}
            height={500}
          />
        </div>
      </div>
    </>
  );
}
