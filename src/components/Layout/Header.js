import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import TasksStore from "../../store/tasks-store";
import styles from "./Header.module.css";

const Header = function (props) {
  const tasksCtx = useContext(TasksStore);
  const [isOpenNav, setIsOpenNav] = useState(false);

  const navOpenHandler = (e) => {
    setIsOpenNav((init) => !init);
  };

  const navCloseHandler = () => {
    setIsOpenNav(false);
  };

  const logoutHandler = () => {
    tasksCtx.logout();
    tasksCtx.setTasks([]);
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Todo</h2>
      <div className={styles.container}>
        <div className={styles.action}>
          {tasksCtx.isLoggedIn && (
            <button
              type="button"
              className={styles.btn}
              onClick={props.onClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={"50"}
                height={"50"}
                viewBox="0 0 50 50"
              >
                <line
                  x1={25}
                  y1={5}
                  x2={25}
                  y2={45}
                  stroke="#888"
                  strokeWidth={5}
                ></line>
                <line
                  y1={25}
                  x1={5}
                  y2={25}
                  x2={45}
                  stroke="#888"
                  strokeWidth={5}
                ></line>
              </svg>
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={navOpenHandler}
          className={isOpenNav ? styles["active-nav-btn"] : styles["nav-btn"]}
        ></button>
        <nav
          className={isOpenNav ? styles["active-nav"] : styles.nav}
          onClick={navCloseHandler}
        >
          {!tasksCtx.isLoggedIn && (
            <NavLink
              to={"/auth"}
              className={(navData) =>
                navData.isActive
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              Login
            </NavLink>
          )}
          {tasksCtx.isLoggedIn && (
            <NavLink
              to={"/profile"}
              className={(navData) =>
                navData.isActive
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              Profile
            </NavLink>
          )}

          {tasksCtx.isLoggedIn && (
            <NavLink
              to={"/all-tasks"}
              className={(navData) =>
                navData.isActive
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              Tasks
            </NavLink>
          )}

          {tasksCtx.isLoggedIn && (
            <button className={styles.logout} onClick={logoutHandler}>
              Log Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
