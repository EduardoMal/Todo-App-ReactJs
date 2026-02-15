import { NavLink, Outlet } from "react-router-dom";

import styles from "./Profile.module.css";

const Profile = function (props) {
  return (
    <div className={styles.container}>
      <h1>User Profile</h1>

      <div className={styles.info}>
        <figure className={styles.avatar}>
          {props.image && (
            <img
              src={props.image}
              alt="User Avatar"
              className={styles.avatarImage}
            />
          )}
          {!props.image && (
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              width={50}
              height={50}
              viewBox="0 0 50 50"
            >
              <text
                fill="white"
                textAnchor="middle"
                alignmentBaseline="middle"
                x={"25"}
                y={"25"}
              >
                {props.name[0]}
              </text>
            </svg>
          )}
        </figure>
        <p>
          <strong>Name:</strong> {props.name}
        </p>
        <p>
          <strong>Email:</strong> {props.email}
        </p>
      </div>
      <div className={styles.actions}>
        <NavLink
          to="update"
          className={(navData) =>
            navData.isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Update Profile
        </NavLink>
        <NavLink
          to="password"
          className={(navData) =>
            navData.isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Change Password
        </NavLink>
        <button type="button" onClick={props.onLogOut}>
          Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;
