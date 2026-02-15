import { useContext, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { UPDATE_URL, API_KEY } from "../../utils/config/config";
import TasksStore from "../../store/tasks-store";
import ErrorModal from "../UI/ErrorModal";
import Overlay from "../UI/Overlay";
import styles from "./ProfileForm.module.css";

const ProfileForm = function () {
  const tasksCtx = useContext(TasksStore);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const [enteredName, setEnteredName] = useState("");

  const cancelHandler = () => {
    navigate("/profile", { replace: true });
  };

  const nameChangeHandler = (e) => {
    setEnteredName(e.target.value);
  };

  const profileUpdateHandler = (e) => {
    e.preventDefault();

    const url = `${UPDATE_URL}${API_KEY}`;

    (async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            displayName: enteredName,
            idToken: tasksCtx.token,
            returnSecureToken: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          let errorMessage = "Could not update profile.";
          const errData = await response.json();
          if (errData && errData.error.message) {
            errorMessage = `${errData.error.code}: ${errData.error.message}`;
          }
          throw new Error(errorMessage);
        } else {
          const data = await response.json();

          tasksCtx.updateProfile({
            userID: data.localId,
            photoUrl: data.photoUrl,
            email: data.email,
            displayName: data.displayName,
          });
          navigate("/profile", { replace: true });
        }
      } catch (error) {
        setErr(error.message);
      }
    })();
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
      <form className={styles.form} onSubmit={profileUpdateHandler}>
        <div className={styles.control}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={enteredName}
            onChange={nameChangeHandler}
            required
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button className={styles.update}>Update</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
