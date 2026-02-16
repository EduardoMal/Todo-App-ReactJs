import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { calcRemainingTime } from "../../utils/helpers/calculate";
import styles from "./Task.module.css";

const Task = function (props) {
  const { id, date, time, title, group } = props;
  const location = useLocation();

  const checkboxChangeHandler = (e) => {
    props.onChecked(id, e.target.checked);
  };

  useEffect(() => {
    const remainingTime = calcRemainingTime(date + " " + time);
    if (remainingTime >= 0) {
      (async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // const notificationReg =
          //   await navigator.serviceWorker.getRegistration();
          if (navigator.serviceWorker.controller) {
            setTimeout(() => {
              navigator.serviceWorker.controller.postMessage({
                title,
                body: "Task is due.",
                icon: "/icon.svg",
                data: { tag: group },
                url: `${location.pathname}`,
              });
            }, remainingTime);
          }
        }
      })();
    }
  }, [date, time, title, location, group]);

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
