import styles from "./Tasks.module.css";

const Tasks = function (props) {
  return <section className={styles.tasks}>{props.children}</section>;
};

export default Tasks;
