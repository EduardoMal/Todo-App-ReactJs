import { useRef, useContext, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import TasksStore from "../../store/tasks-store";
import ErrorModal from "../UI/ErrorModal";
import { PASSWORD_CHANGE_URL } from "../../utils/config/config";
import styles from "./ProfileForm.module.css";
import Overlay from "../UI/Overlay";

const PasswordForm = function () {
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const tasksCtx = useContext(TasksStore);
  const passwordRef = useRef();
  const API_KEY = process.env.REACT_APP_API_KEY;

  const cancelHandler = () => {
    navigate("/profile", { replace: true });
  };

  const passwordSubmitHandler = (e) => {
    e.preventDefault();
    const enteredPassword = passwordRef.current.value;
    const sendRequest = async () => {
      try {
        const response = await fetch(`${PASSWORD_CHANGE_URL}${API_KEY}`, {
          method: "POST",
          body: JSON.stringify({
            idToken: tasksCtx.token,
            returnSecureToken: false,
            password: enteredPassword,
          }),
        });

        if (!response.ok) {
          let errorMessage = "Could not change password.";
          const data = await response.json();
          if (data && data.error.message) {
            errorMessage = `${data.error.code}: ${data.error.message}`;
          }
          throw new Error(errorMessage);
        }

        navigate("/profile", { replace: true });
      } catch (error) {
        setErr(error.message);
      }
    };

    sendRequest();
  };

  if (err) {
    return (
      <Fragment>
        <Overlay onClick={() => setErr(null)} />
        <ErrorModal text={err} />
      </Fragment>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={passwordSubmitHandler}>
        <div className={styles.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={passwordRef} required />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={cancelHandler}
            className={styles.cancel}
          >
            Cancel
          </button>
          <button className={styles.update}>Update Password</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
