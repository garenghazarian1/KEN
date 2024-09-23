import styles from "./PageEleven.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image";

export default function PageEleven() {
  return (
    <>
        <div className={styles.containerD}>
            <div className={styles.leftPaneD}>
                <Image src="/logo01.png" alt="K Logo" className={styles.imageD} width={250} height={250} />
            </div>
            <div id="TheDesigner" className={styles.rightPaneD}>
                <p className={`${inter.className} ${styles.textNumDA}`}>04</p>
                <p className={`${inter.className} ${styles.textNumDB}`}>The Designer</p>
                <p className={`${styles.textNumDC} ${bad.className}`}>Behind Ken Salon</p>
            </div>
        </div>
 </>
  )
}

