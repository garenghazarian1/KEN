import styles from "./PageSeven.module.css"
import {inter, bad} from "@/app/ui/fonts"
import Image from "next/image";

export default function PageSeven() {
  return (
    <>
        <div className={styles.containerD}>
            <div className={styles.leftPaneD}>
                <Image src="/logo01.png" alt="K Logo" className={styles.imageD} width={250} height={250} />
            </div>
            <div id="OurLocations" className={styles.rightPaneD}>
                <p className={`${inter.className} ${styles.textNumDA}`}>02</p>
                <p className={`${inter.className} ${styles.textNumDB}`}>Our</p>
                <p className={`${styles.textNumDC} ${bad.className}`}>Locations</p>
            </div>
        </div>
 </>
  )
}
