import styles from "./PageSeventeen.module.css"
import { bad} from "@/app/ui/fonts"

export default function PageSeventeen() {
  return (
   <><div className={styles.container}>
        <div className={styles.content}>
            <h2 className={styles.num}>01</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Professionalism:</h3>
            <p className={styles.text}>We maintain the highest standards of professionalism, ensuring integrity and reliability in all interactions.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>02</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Friendliness:</h3>
            <p className={styles.text}>Our team fosters a warm and welcoming atmosphere, making every client feel valued and appreciated.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>03</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Creativity:</h3>
            <p className={styles.text}>Innovation and originality drive our approach to hairstyling and beauty, resulting in unique and stunning looks tailored to each client.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>04</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Cleanliness:</h3>
            <p className={styles.text}>Our salon proper and sanitation, maintaining a pristine environment to ensure the health and safety of our clients.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>05</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Commitment to Excellence:</h3>
            <p className={styles.text}>We are dedicated to exceeding expectations and continuously striving for excellence in every aspect of our service delivery.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>06</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Continuous Improvement:</h3>
            <p className={styles.text}>We are committed to ongoing learning and development, constantly seeking opportunities to enhance our skills, services, and overall salon experience for our clients benefit.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>07</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Customer Satisfaction:</h3>
            <p className={styles.text}>Our primary focus is on ensuring that every client leaves our salon completely satisfied with their experience, from the moment they walk into the moment they leave.</p>
        </div>
   </div>
   </>
  )
}
