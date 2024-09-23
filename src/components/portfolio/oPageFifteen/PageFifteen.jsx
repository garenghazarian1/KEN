import styles from "./PageFifteen.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image"

export default function PageFifteen() {
  return (
    <>
        <div className={styles.containerD}>
            <div className={styles.leftPaneD}>
                 {/* <Image src="/portfolio/philosophy01.jpg" alt="K Logo" className={styles.imageD} width={250} height={250} />  */}
                 <Image src="/portfolio/philosophy02.jpg" alt="K Logo" className={styles.imageD} width={250} height={250} /> 
            </div>

            <div className={styles.middlePane}>
            <p className={styles.paragraph}>We believe beauty is a deeply emotional journey and a reflection of your true self. With every touch and every stroke, we unveil the innate allure that lies within you. Our hearts beat with yours as we celebrate your individuality, weaving your personal story into timeless looks that honor your unique essence and cultural heritage. Come and and immerse yourself in our sanctuary of luxury and rejuvenation, where every moment is a heartfelt embrace of your beauty and inner strength.</p>
            </div>
            <div id="OurPhilosophy" className={styles.rightPaneD}>
                <p className={`${inter.className} ${styles.textNumDA}`}>07</p>
                <p className={`${inter.className} ${styles.textNumDB}`}>Our</p>
                <p className={`${styles.textNumDC} ${bad.className}`}>Philosophy</p>
            </div>
            
           
        </div>
 </>
  )
}
