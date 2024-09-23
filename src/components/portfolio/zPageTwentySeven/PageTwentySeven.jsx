import styles from "./PageTwentySeven.module.css"

export default function PageTwentySeven() {
  return (
    <>
    <div className={styles.container}>
      <div className={styles.sectionA}>
          <h2 className={styles.sectionAHeader}>
            PRESS
          </h2>
          <p className={styles.sectionAText}>
            Discover how Ken has reshaped the landscape of hair fashion and trends in these engaging articles. Explore the groundbreaking approaches and visionary insights that have propelled Ken to the forefront of the beauty industry. Dive deeper to witness the impact of Ken&apos;s creative vision on the world of hairstyling.
          </p>
      </div>
                
        <div className={styles.sectionB}>
          {/* <h2 className={styles.sectionAHeader}> We Are Featured in the Press and Media</h2> */}
             <video src="/portfolio/press.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
             <video src="/portfolio/pressYerevan.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
        </div>

    </div>
    </>
  )
}
