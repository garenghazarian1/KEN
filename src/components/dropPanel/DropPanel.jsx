import styles from "./dropPanel.module.css";

/** Keep in step with the 0.8s grid transition in dropPanel.module.css. */
export const DROP_PANEL_MS = 800;

export function DropPanel({ open, children }) {
  return (
    <div
      className={open ? `${styles.panel} ${styles.open}` : styles.panel}
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : ""}
    >
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

export const dropChevronClass = styles.chevron;
