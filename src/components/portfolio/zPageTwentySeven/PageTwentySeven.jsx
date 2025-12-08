import Image from "next/image";
import styles from "./PageTwentySeven.module.css";

export default function PageTwentySeven() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.sectionA}>
          <h2 className={styles.sectionAHeader}>PRESS</h2>
          <p className={styles.sectionAText}>
            Discover how Ken has reshaped the landscape of hair fashion and
            trends in these engaging articles. Explore the groundbreaking
            approaches and visionary insights that have propelled Ken to the
            forefront of the beauty industry. Dive deeper to witness the impact
            of Ken&apos;s creative vision on the world of hairstyling.
          </p>
        </div>

        <div className={styles.sectionB}>
          <Image
            src="/portfolio/press.jpg"
            alt="Press coverage"
            width={1200}
            height={800}
            className={styles.video}
            priority
          />
        </div>
      </div>
    </>
  );
}
