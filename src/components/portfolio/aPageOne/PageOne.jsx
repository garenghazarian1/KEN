"use client"
import Image from "next/image";
import styles from "./PageOne.module.css";

export default function PageOne() {

  return (
    <>
    {/* PAGE01 */}
    <div className={styles.containerA}>
      <div className={styles.leftPaneA}>
        <Image src="/logo01.png" alt="Ken Salon Portfolio" width={350} height={350} className={styles.imageA} />
        <div className={styles.portfolioTextA}>PORTFOLIO</div> 
      </div>
      <div className={styles.rightPaneA}>
        <Image src="/ken.jpg" alt="Ken Salon Portfolio" width={500} height={500}  />
      </div>
    </div>
    </>
  );
};