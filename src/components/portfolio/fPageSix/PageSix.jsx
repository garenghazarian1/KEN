import Image from "next/image";
import styles from "./PageSix.module.css";
import {bad} from "@/app/ui/fonts"

export default function PageSix() {
  return (
    <>
      <div className={styles.containerF}>
        <div className={styles.subContainerFA}>
          <Image 
            src="/portfolio/portfolioE001.jpg" 
            alt="Portfolio Image 1" 
            width={500} 
            height={500} 
            className={styles.imageFA}
          />
          <p className={`${styles.paragraphFA} ${bad.className}`}>
          Here, the art of hair styling, cutting, coloring, and skincare transcends mere services, becoming a sacred ritual that unveils the beauty within. Each visit is a journey of self-discovery guided by a team of artisans whose skills are matched only by their unwavering dedication to your satisfaction.
          </p>
        </div>
        <div className={styles.subContainerFB}>
          <p className={`${styles.paragraphFB} ${bad.className}`}>
          At Ken Salon, beauty is not merely a pursuit, it is a celebration of life&apos;s most exquisite moments. Every strand of hair, every brushstroke of color, and every delicate touch is a testament to the salon&apos;s unwavering commitment to highlighting the inherent beauty in every individual. Step into this sanctuary of magnificence, where dreams of confidence and allure take flight, and allow Ken Salon to unveil the most beautiful version of yourself.
          </p>
          <Image 
            src="/portfolio/portfolioE003.jpg" 
            alt="Portfolio Image 2" 
            width={500} 
            height={500} 
            className={styles.imageFB}
          />
        </div>
      </div>
    </>
  );
}
