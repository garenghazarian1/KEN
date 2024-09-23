"use client";
import { useEffect } from "react";
import styles from "./Portfolio.module.css";
import { motion } from "framer-motion";

import PageOne from "./aPageOne/PageOne";
import PageTwo from "./bPageTwo/PageTwo";
import PageThree from "./cPageThree/PageThree";
import PageFour from "./dPageFour/PageFour";
import PageFive from "./ePageFive/PageFive";
import PageSix from "./fPageSix/PageSix";
import PageSeven from "./gPageSeven/PageSeven";
import PageEight from "./hPageEight/PageEight";
import PageNine from "./iPageNine/PageNine";
import PageTen from "./jPageTen/PageTen";
import PageEleven from "./kPageEleven/PageEleven";
import PageTwelve from "./lPageTwelve/PageTwelve";
import PageThirteen from "./mPageThirteen/PageThirteen";
import PageFourteen from "./nPageFourteen/PageFourteen";
import PageFifteen from "./oPageFifteen/PageFifteen";
import PageSixteen from "./pPageSixteen/PageSixteen";
import PageSeventeen from "./qPageSeventeen/PageSeventeen";
import PageEighteen from "./rPageEighteen/PageEighteen";
import PageNineteen from "./sPageNineteen/PageNineteen";
import PageTwenty from "./tPageTwenty/PageTwenty";
import PageTwentyOne from "./tPageTwentyOne/PageTwentyOne";
import PageTwentyTwo from "./uPageTwentyTwo/PageTwentyTwo";
import PageTwentyThree from "./vTwentyThree/PageTwentyThree";
import PageTwentyFour from "./wPageTwentyFour/PageTwentyFour";
import PageTwentyFive from "./xPageTwentyFive/PageTwentyFive";
import PageTwentySix from "./yPageTwentySix/PageTwentySix";
import PageTwentySeven from "./zPageTwentySeven/PageTwentySeven";

export default function Portfolio() {
  useEffect(() => {
    const handleScroll = () => {
      const button = document.getElementById("backToTop");
      if (window.scrollY > 300) {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageOne />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwo />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageThree />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageFour />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageFive />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageSix />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageSeven />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageEight />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageNine />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageEleven />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwelve />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageThirteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageFourteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageFifteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageSixteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageSeventeen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageEighteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageNineteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwenty />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentyOne />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentyTwo />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentyThree />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentyFour />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentyFive />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentySix />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
      >
        <PageTwentySeven />
      </motion.div>
      <button onClick={scrollToTop} id="backToTop" className={styles.backToTop}>
        ↑ Top
      </button>
    </>
  );
}
