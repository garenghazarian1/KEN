import styles from "./FitName.module.css";

export default function FitName({ className, children }) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  return <span className={classes}>{children}</span>;
}
