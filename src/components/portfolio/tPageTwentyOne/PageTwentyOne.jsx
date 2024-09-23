import styles from "./PageTwentyOne.module.css"
import { bad} from "@/app/ui/fonts"

export default function PageTwentyOne() {
  return (
    <>
        <div className={styles.container}>
            
             
            <div className={styles.sectionB}>
                <div className={styles.content}>
                    <h2 className={styles.num}>01</h2>
                    <h3 className={`${styles.header} ${bad.className}`}>Regular Cut:</h3>
                    <p className={styles.text}>Achieve a fresh and polished look with our expertly executed regular haircuts. Our skilled barbers will tailor the cut to suit your style and preferences, leaving you looking sharp and confident.</p>
                </div>
                <div className={styles.content}>
                    <h2 className={styles.num}>02</h2>
                    <h3 className={`${styles.header} ${bad.className}`}>Shaving:</h3>
                    <p className={styles.text}>Experience the ultimate grooming experience with our classic shaving services. Using precise techniques and high-quality products, our barbers will ensure a smooth and comfortable shave, leaving your skin feeling refreshed and rejuvenated.</p>
                </div>
                <div className={styles.content}>
                    <h2 className={styles.num}>03</h2>
                    <h3 className={`${styles.header} ${bad.className}`}>Beard Trim Line-Up:</h3>
                    <p className={styles.text}>Maintain your signature style with our professional beard trimming and lining services. Our barbers will sculpt and shape your beard to perfection, enhancing your facial features and creating a polished look.</p>
                </div>

                     
                <div className={styles.content}>
                    <h2 className={styles.num}>04</h2>
                    <h3 className={`${styles.header} ${bad.className}`}>Beard Dyeing:</h3>
                    <p className={styles.text}>Enhance the color and definition of your beard with our beard dyeing services. Whether you&apos;re looking to cover gray hairs or experiment with a new hue, our expert barbers will deliver natural-looking results that complement your style.</p>
                </div>
                <div className={styles.content}>
                    <h2 className={styles.num}>05</h2>
                    <h3 className={`${styles.header} ${bad.className}`}>Manicure and Pedicure:</h3>
                    <p className={styles.text}>Treat yourself to a pampering manicure and pedicure session designed specifically for men. Relax and unwind as our technicians groom and buff your nails, leaving your hands and feet looking and feeling their best.</p>
                </div>
                <div className={styles.content}>
                    <h2 className={styles.num}>06</h2>
                    <h3 className={`${styles.header} ${bad.className}`}>Facials:</h3>
                    <p className={styles.text}>Revitalize your skin with our rejuvenating facial treatments tailored to men&apos;s skincare needs. Our experienced estheticians will cleanse, exfoliate, and moisturize your skin, leaving it refreshed, hydrated, and glowing with health.</p>
                </div>
            </div>
            <div className={styles.sectionA}>
                <video src="/portfolio/description05.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
            </div>
        </div>
    </>
  )
}
