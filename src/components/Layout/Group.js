import { NavLink } from "react-router-dom";

import styles from "./Group.module.css";

const Group = function (props) {
  return (
    <li className={styles.group}>
      <NavLink
        to={props.path}
        className={(navData) => (navData.isActive ? styles.active : "")}
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
        <div className={styles.title}>{props.title}</div>
      </NavLink>
    </li>
  );
};

export default Group;
