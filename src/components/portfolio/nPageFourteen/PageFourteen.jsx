import styles from "./PageFourteen.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image"

export default function PageFourteen() {
  return (
    <>
        <div className={styles.containerD}>
            <div className={styles.leftPaneD}>
                 <Image src="/portfolio/mission01.jpg" alt="K Logo" className={styles.imageD} width={250} height={250} /> 
               
            </div>

            <div className={styles.middlePane}>
            <p className={styles.paragraph}>At Ken Salon, we are devoted to creating an unparalleled sanctuary where women and men alike can experience the transformative magic of beauty. Our mission is to deliver bespoke experiences that elevate hairstyling, skincare, and grooming to extraordinary levels. With meticulous attention to detail, cutting-edge techniques, and luxurious products, we aim to nurture your confidence and empower you to shine as your most beautiful self.</p>
            </div>
            <div id="OurMission" className={styles.rightPaneD}>
                <p className={`${inter.className} ${styles.textNumDA}`}>06</p>
                <p className={`${inter.className} ${styles.textNumDB}`}>Our</p>
                <p className={`${styles.textNumDC} ${bad.className}`}>Mission</p>
            </div>
            
           
        </div>
 </>
  )
}
