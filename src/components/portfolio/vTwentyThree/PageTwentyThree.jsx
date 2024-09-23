import styles from "./PageTwentyThree.module.css"
import { bad} from "@/app/ui/fonts"
export default function PageTwentyThree() {
  return (
    <>
    <div className={styles.container}>
      <div className={styles.sectionB}>
        <h2 className={`${styles.header} ${bad.className}`}>Celebrities We Work With</h2>
        <p className={styles.text}>We&apos;ve etched our name as the pinnacle of service and artistry in the hair and beauty domain, where every moment is infused with passion and dedication. Our unyielding commitment to excellence has forged bonds of trust with cherished celebrities, who turn to us for their most intimate beauty journeys. It fills us with profound pride to have walked alongside luminaries from diverse backgrounds, sharing in their dreams and aspirations.</p>
      </div>

      <div>
       
         <div className={styles.sectionA}>
                <video src="/portfolio/Celeb01.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
            </div>


      </div>

    </div>
    
    </>
  )
}
