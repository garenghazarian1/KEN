import Image from "next/image";
import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <Image src="/logo03.png" alt="loading" loading="lazy" as="image" width={100} height={100}   className={styles.logo} />
    </div>
  );
}
 