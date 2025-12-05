import Image from "next/image";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.flexCenter}>
      <div className={styles.paddedRelative}>
        <Image
          src="/logo03.png"
          alt="Ken Beauty Salon logo"
          width={50}
          height={50}
          className={styles.image}
          priority
        />
      </div>
    </div>
  );
}
