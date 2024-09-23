import styles from "./PageTwentyFour.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image"

export default function PageTwentyFour() {
    return (
        <div className={styles.containerD}>
        <div className={styles.leftPaneD}>
              <Image src="/logo01.png" alt="K Logo" className={styles.imageD} width={250} height={250} />  
             
        </div>
    
        
        <div id="CommunityEngagement" className={styles.rightPaneD}>
            <p className={`${inter.className} ${styles.textNumDA}`}>11</p>
            <p className={`${inter.className} ${styles.textNumDB}`}>Community</p>
            <p className={`${styles.textNumDC} ${bad.className}`}>Engagement</p>
        </div>
        
       
    </div>
      )
}
