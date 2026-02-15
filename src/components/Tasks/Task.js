import { Link } from "react-router-dom";
import styles from "./Task.module.css";

const Task = function (props) {
  const { id } = props;

  const checkboxChangeHandler = (e) => {
    props.onChecked(id, e.target.checked);
  };

  return (
    <li
      className={`${styles.task} ${props.className === "overdue" ? styles.overdue : ""}`}
    >
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={50}
          height={50}
          viewBox="-25 -25 50 50"
        >
          <circle x={25} y={25} r={18} fill={props.iconColor}></circle>
        </svg>
      </div>

      <div className={styles.details}>
        <header>{props.title}</header>
        <main>{props.description}</main>
        <footer>{props.date + " " + props.time}</footer>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          onChange={checkboxChangeHandler}
          checked={!!props.completed}
        />
      </div>
      <div className={styles.link}>
        <Link to={`/task-details/${props.id}`}>View Details</Link>
      </div>
    </li>
  );
};

export default Task;
