"use client"

import styles from "./PageTwo.module.css";
import {gv, inter} from "@/app/ui/fonts"

export default function PageTwo() {

    const handleScroll = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const offset = 200; // Offset to stop before the section
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition - offset;
      
          window.scrollBy({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      };
  return (
    <>
 
    {/* PAGE02 */}
    <div className={styles.containerB}>
      <div className={styles.containerBHeader}>
      <p className={`${styles.headerB} ${inter.className}`}>Table of 
        <div><span className={`${styles.headerBUnderline} ${gv.className}`}>Content</span></div></p>
        </div>
      <div className={styles.itemsB}>
      <div className={styles.itemB} onClick={() => handleScroll("whoWeAre")}>
            <p className={styles.numB}>01</p>
            <p className={styles.textB}>Who We Are</p> </div>
        <div className={styles.itemB} onClick={() => handleScroll("OurLocations")}>
            <p className={styles.numB}>02</p>
        <p className={styles.textB}>Our Locations</p> </div>
        <div className={styles.itemB}  onClick={() => handleScroll("SocialMedia")}>
            <p className={styles.numB}>03</p>
        <p className={styles.textB}>Social Media</p> 
        <br  className={styles.br}/>
        <br className={styles.br}/>
        </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("TheDesigner")}>04</p>
        <p className={styles.textB}>The Designer Behind Ken Salon</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("OurVision")}>05</p>
        <p className={styles.textB}>Vision</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("OurMission")}>06</p>
        <p className={styles.textB}>Mission</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("OurPhilosophy")}>07</p>
        <p className={styles.textB}>Philosophy</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("CoreValues")}>08</p>
        <p className={styles.textB}>Core Values</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("Services")}>09</p>
        <p className={styles.textB}> Services</p>
        <br className={styles.br}/>
        </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("Celebrities")}>10</p>
        <p className={styles.textB}>Clients We Work With</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("CommunityEngagement")}>11</p>
        <p className={styles.textB}>Community Engagement</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB} onClick={() => handleScroll("Press")}>12</p>
        <p className={styles.textB}>Press & Media Features</p> </div>
      </div>
    </div>
    </>
    );
    }