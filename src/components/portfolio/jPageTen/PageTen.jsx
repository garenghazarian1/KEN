import Image from "next/image";
import styles from "./PageTen.module.css";
import Link from "next/link";
import { SOCIAL_MEDIA, SOCIAL_HANDLES } from "@/config/constants";

export default function PageTen() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.profiles}>
          <div className={styles.profile}>
            <Link
              href={SOCIAL_MEDIA.instagram.barbershop}
              target="_blank"
              aria-label={`Follow us on Instagram: ${SOCIAL_HANDLES.instagram.barbershop}`}
            >
              <Image
                src="/portfolio/barberShop.webp"
                alt="Ken Barbershop Instagram profile"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <p className={styles.username}>
                @{SOCIAL_HANDLES.instagram.barbershop}
              </p>
            </Link>
          </div>
          <div className={styles.profile}>
            <Link
              href={SOCIAL_MEDIA.instagram.beauty}
              target="_blank"
              aria-label={`Follow us on Instagram: ${SOCIAL_HANDLES.instagram.beauty}`}
            >
              <Image
                src="/portfolio/insta02.webp"
                alt="Ken Beauty Instagram profile"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <p className={styles.username}>
                @{SOCIAL_HANDLES.instagram.beauty}
              </p>
            </Link>
          </div>
          <div className={styles.profile}>
            <Link
              href={SOCIAL_MEDIA.instagram.ghazarian}
              target="_blank"
              aria-label={`Follow us on Instagram: ${SOCIAL_HANDLES.instagram.ghazarian}`}
            >
              <Image
                src="/portfolio/insta01.webp"
                alt="Ken Ghazarian Instagram profile"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <p className={styles.username}>
                @{SOCIAL_HANDLES.instagram.ghazarian}
              </p>
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
