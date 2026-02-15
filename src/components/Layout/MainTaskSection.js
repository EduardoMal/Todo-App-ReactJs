import styles from "./MainTaskSection.module.css";

const MainTaskSection = function (props) {
  return <section className={styles.section}>{props.children}</section>;
};

export default MainTaskSection;
