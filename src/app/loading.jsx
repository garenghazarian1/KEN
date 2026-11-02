import LoadingSkeletonModern from "@/components/loading/LoadingSkeleton.modern";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.reserve}>
      <LoadingSkeletonModern />
    </div>
  );
}
