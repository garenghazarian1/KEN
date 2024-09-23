import Image from "next/image";
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.flexCenter}>
      <div className={styles.paddedRelative}>
        <Image
          src="/logo03.png"
          alt="logo"
          width={50}
          height={50}
          priority={false}
          preload="auto"
          className={styles.image}
        />
      </div>
    </div>
  );
}
