import Image from "next/image";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.flexCenter}>
      <div className={styles.paddedRelative}>
        <Image
          src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727122226/logo03_olcvzr.png"
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
