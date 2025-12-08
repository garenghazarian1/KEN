"use client";
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
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageOne />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwo />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageThree />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageFour />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageFive />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageSix />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageSeven />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageEight />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageNine />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageEleven />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwelve />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageThirteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageFourteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageFifteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageSixteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageSeventeen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageEighteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageNineteen />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwenty />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentyOne />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentyTwo />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentyThree />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentyFour />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentyFive />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentySix />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        variants={fadeInVariants}
      >
        <PageTwentySeven />
      </motion.div>
    </>
  );
}
