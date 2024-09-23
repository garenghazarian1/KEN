import styles from "./PageSixteen.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image"

export default function PageSixteen() {
  return (
    <>
    <div className={styles.containerD}>
        <div className={styles.leftPaneD}>
              <Image src="/logo01.png" alt="K Logo" className={styles.imageD} width={250} height={250} />  
             
        </div>

        
        <div id="CoreValues" className={styles.rightPaneD}>
            <p className={`${inter.className} ${styles.textNumDA}`}>08</p>
            <p className={`${inter.className} ${styles.textNumDB}`}>Core</p>
            <p className={`${styles.textNumDC} ${bad.className}`}>Values</p>
        </div>
        
       
    </div>
</>
  )
}
