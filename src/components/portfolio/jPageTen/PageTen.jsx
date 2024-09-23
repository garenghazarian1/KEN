import Image from "next/image";
import styles from "./PageTen.module.css";
import Link from "next/link";

export default function PageTen() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.profiles}>
          <div className={styles.profile}>
            <Link
              href="https://www.instagram.com/ken_barbershop.ad/"
              target="_blank"
            >
              <Image
                src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727125282/barberShop_j8orj7.jpg"
                alt="KenInstagram"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <p className={styles.username}>@ken_barbershop_ad</p>
            </Link>
          </div>
          <div className={styles.profile}>
            <Link
              href="https://www.instagram.com/ken_beauty_ad/"
              target="_blank"
            >
              <Image
                src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727125329/insta02_ket2ej.jpg"
                alt="KenInstagram01"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <p className={styles.username}>@ken_beauty_ad</p>
            </Link>
          </div>
          <div className={styles.profile}>
            <Link
              href="https://www.instagram.com/ken_ghazarian/"
              target="_blank"
            >
              <Image
                src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727125377/insta01_uyu4hh.jpg"
                alt="KenInstagram01"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <p className={styles.username}>@ken_ghazarian</p>
            </Link>
          </div>
        </div>
        <div className={styles.textContainer}>
          <p>
            Follow Ken Salon on Instagram for the latest updates, beauty
            inspiration, and exclusive promotions!
          </p>
          <p>
            Join our vibrant community, stay connected, and let us be your muse
            on your journey to radiant confidence and timeless allure.
          </p>
        </div>
      </div>
    </>
  );
}
