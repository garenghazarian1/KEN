import Image from "next/image"
import styles from "./PageTen.module.css"
import Link from "next/link"

export default function PageTen() {
  return (
   <>
   <div className={styles.container}>
      <div className={styles.profiles}>
        <div className={styles.profile}>
        <Link href="https://www.instagram.com/ken_barbershop.ad/"  target="_blank">
          <Image src="/portfolio/barberShop.jpg" alt="KenInstagram" className={styles.profileImage} width={500} height={500} />
          <p className={styles.username}>@ken_barbershop_ad</p>
          </Link>
        </div>
        <div className={styles.profile}>
        <Link href="https://www.instagram.com/ken_beauty_ad/"  target="_blank">
          <Image src="/portfolio/insta02.jpg" alt="KenInstagram01" className={styles.profileImage} width={500} height={500} />
          <p className={styles.username}>@ken_beauty_ad</p>
          </Link>
        </div>
        <div className={styles.profile}>
        <Link href="https://www.instagram.com/ken_ghazarian/"  target="_blank">
          <Image src="/portfolio/insta01.jpg" alt="KenInstagram01" className={styles.profileImage} width={500} height={500} />
          <p className={styles.username}>@ken_ghazarian</p>
          </Link>
        </div>
      </div>
      <div className={styles.textContainer}>
        <p>Follow Ken Salon on Instagram for the latest updates, beauty inspiration, and exclusive promotions!</p>
        <p>Join our vibrant community, stay connected, and let us be your muse on your journey to radiant confidence and timeless allure.</p>
      </div>
    </div>
   </>
  )
}
