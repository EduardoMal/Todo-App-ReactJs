import styles from "./Overlay.module.css";

const Overlay = function (props) {
  return <div className={styles.overlay} onClick={props.onClick}></div>;
};

export default Overlay;
