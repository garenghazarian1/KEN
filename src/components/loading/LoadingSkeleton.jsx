import Image from "next/image";
import { NAVBAR_LOGO_DEFAULT_SRC } from "@/config/constants";
import styles from "./LoadingSkeleton.module.css";

export default function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <Image
        src={NAVBAR_LOGO_DEFAULT_SRC}
        alt="loading"
        as="image"
        width={100}
        height={100}
        priority
        className={styles.logo}
        style={{ width: "100px", height: "100px", objectFit: "contain" }}
      />
    </div>
  );
}
