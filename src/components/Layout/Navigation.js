import styles from "./Navigation.module.css";
import Group from "./Group";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navigation = function () {
  const location = useLocation();
  const [navPath, setNavPath] = useState(location.pathname);
  const navigate = useNavigate();

  const navChangeHandler = (e) => {
    setNavPath(e.target.value);
  };

  useEffect(() => {
    navigate(navPath, { replace: true });
  }, [navPath, navigate]);

  return (
    <section className={styles.section}>
      <select
        className={styles.select}
        value={navPath}
        onChange={navChangeHandler}
      >
        <option value={"/all-tasks"}>All Tasks</option>
        <option value={"/work"}>Work</option>
        <option value={"/study"}>Study</option>
        <option value={"/entertainment"}>Entertainment</option>
        <option value={"/family"}>Family</option>
      </select>
      <ul className={styles.navigation}>
        <Group path="/all-tasks" title="All Tasks" />
        <Group path="/work" title="Work" iconColor="#99f575" />
        <Group path="/study" title="Study" iconColor="#510080" />
        <Group
          path="/entertainment"
          title="Entertainment"
          iconColor="#e2c7cc"
        />
        <Group path="/family" title="Family" iconColor="#3fdfaf" />
      </ul>
    </section>
  );
};

export default Navigation;
