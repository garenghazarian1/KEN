import styles from "./PageThirteen.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image";

export default function PageThirteen() {
  return (
    <>
        <div className={styles.containerD}>



            <div className={styles.leftPaneD}>
                 <Image src="/portfolio/vision.jpg" alt="K Logo" className={styles.imageD} width={250} height={250} /> 
               
            </div>

            <div className={styles.middlePane}>
            <p className={styles.paragraph}>To reign supreme in the UAE&apos;s luxury hair and beauty scene, redefining the art of pampering and self-care. We aspire to craft transformative experiences that celebrate your unique beauty, boost your confidence, and pursue aesthetic perfection with relentless passion. At Ken Salon, every visit is a voyage into unmatched excellence, where your individuality becomes our masterpiece.</p>
            </div>
            <div id="OurVision" className={styles.rightPaneD}>
                <p className={`${inter.className} ${styles.textNumDA}`}>05</p>
                <p className={`${inter.className} ${styles.textNumDB}`}>Our</p>
                <p className={`${styles.textNumDC} ${bad.className}`}>Vision</p>
            </div>
            
           
        </div>
 </>
  )
}
