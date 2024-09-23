import styles from "./PageTwentyFive.module.css"

export default function PageTwentyFive() {
  return (
    <>
    <div className={styles.container}>
        <div className={styles.sectionA}>
            <div className={styles.sectionAContent}>
                <h2 className={styles.sectionAHeader}>
                    At Ken Salon:
                </h2>
                <p className={styles.sectionAText}>
                We are profoundly grounded in the understanding that true beauty extends far beyond mere appearances; it&apos;s about leaving a lasting. positive imprint on the lives we touch. As a brand deeply embraced by our local community, we hold a steadfast commitment to giving back and nurturing a spirit of unity through various initiatives.
                Educational Empowerment:
            </p>
            </div>
            <div className={styles.sectionAContent}>
                <h2 className={styles.sectionAHeader}>
                    Educational Empowerment: 
                </h2>
                <p className={styles.sectionAText}>
                We offer complimentary hair and beauty workshops to budding stylists and beauticians, empowering them with invaluable skills and wisdom to flourish in their craft.
                Community Events:
                </p>
            </div>
            <div className={styles.sectionAContent}>
            <h2 className={styles.sectionAHeader}>
                Community Events:
            </h2>
            <p className={styles.sectionAText}>
                Engaging actively in, and sponsoring, community events allows us to strengthen bonds, celebrate our rich local culture, and foster a sense of togetherness that reverberates throughout our community.
            </p>
            </div>
        </div>
        <div className={styles.sectionB}>
             <video src="/portfolio/CommunityEngagement.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
        </div>

    </div>
    </>
  )
}
