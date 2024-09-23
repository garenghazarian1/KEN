import styles from "./PageTwenty.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image"

export default function PageTwenty() {
  return (
    <>
    <div className={styles.containerD}>
        <div className={styles.leftPaneD}>
              <Image src="/logo01.png" alt="K Logo" className={styles.imageD} width={250} height={250} />  
             
        </div>

        
        <div id="Services" className={styles.rightPaneD}>
            <p className={`${inter.className} ${styles.textNumDA}`}>09</p>
            <p className={`${inter.className} ${styles.textNumDB}`}>Services</p>
            <p className={`${styles.textNumDC} ${bad.className}`}>For Him</p>
        </div>
        
       
    </div>
    </>
  )
}
