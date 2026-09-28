import Image from "next/image";
import { NAVBAR_LOGO_DEFAULT_SRC } from "@/config/constants";
import styles from "./LoadingSkeleton.modern.module.css";

export default function LoadingSkeletonModern() {
  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.stage}>
        <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
          <circle className={styles.track} cx="50" cy="50" r="46" pathLength="100" />
          <circle className={styles.arc} cx="50" cy="50" r="46" pathLength="100" />
        </svg>
        <div className={styles.mark}>
          <Image
            src={NAVBAR_LOGO_DEFAULT_SRC}
            alt=""
            width={160}
            height={160}
            priority
            className={styles.logo}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>
      <p className={styles.srOnly}>
        <span lang="en">Loading</span>{" "}
        <span lang="ar">جاري التحميل</span>
      </p>
    </div>
  );
}
