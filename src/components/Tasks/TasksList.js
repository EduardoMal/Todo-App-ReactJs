import { formatDate } from "../../utils/helpers/format";
import Task from "./Task";

import styles from "./TasksList.module.css";

const TasksList = function (props) {
  return (
    <section className={styles.taskSection}>
      <h2 className={styles.sectionTitle}>{props.title}</h2>
      <ul className={styles.tasks}>
        {props.tasks.map((task) => (
          <Task
            key={task.id}
            title={task.title}
            id={task.id}
            completed={task.completed}
            date={formatDate(new Date(task.date + " " + task.time))}
            time={""}
            group={task.group}
            iconColor={props.iconColors[task["group"]]}
            className={props.className}
            onChecked={props.onCompleted}
          />
        ))}
      </ul>
    </section>
  );
};

export default TasksList;
