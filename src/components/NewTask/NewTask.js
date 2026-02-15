import { useContext, useReducer, useState } from "react";
import { ICON_COLORS } from "../../utils/config/config";
import TasksStore from "../../store/tasks-store";
import styles from "./NewTask.module.css";
import { DATABASE_URL } from "../../utils/config/config";

const formReducer = (state, action) => {
  if (action.type === "TITLE") {
    const newState = {
      ...state,
      title: action.value,
      titleIsValid: action.value.trim() !== "",
    };
    return newState;
  }

  if (action.type === "DATE") {
    const newState = {
      ...state,
      date: action.value,
      dateIsValid: action.value.trim() !== "",
    };
    return newState;
  }

  if (action.type === "TIME") {
    const newState = {
      ...state,
      time: action.value,
      timeIsValid: action.value.trim() !== "",
    };
    return newState;
  }

  if (action.type === "DESCRIPTION") {
    const newState = {
      ...state,
      description: action.value,
    };
    return newState;
  }

  if (action.type === "TAG") {
    const newState = {
      ...state,
      group: action.value,
      groupIsValid: !!action.value.trim(),
    };
    return newState;
  }

  return {
    title: "",
    date: "",
    time: "",
    group: "",
    description: "",
    completed: false,
    titleIsValid: false,
    dateIsValid: false,
    timeIsValid: false,
    groupIsValid: false,
  };
};

const NewTask = function (props) {
  const tasksCtx = useContext(TasksStore);
  const [formIsTouched, setFormIsTouched] = useState(false);

  const [enteredData, dispatchEnteredData] = useReducer(formReducer, {
    title: props.task ? props.task.title : "",
    date: props.task ? props.task.date : "",
    time: props.task ? props.task.time : "",
    group: props.task ? props.task.group : "",
    description: props.task ? props.task.description : "",
    completed: props.task ? props.task.completed : false,
    titleIsValid: props.task && props.task.title ? true : false,
    dateIsValid: props.task && props.task.date ? true : false,
    timeIsValid: props.task && props.task.time ? true : false,
    groupIsValid: props.task && props.task.group ? true : false,
  });

  const allRequiredIsValid =
    enteredData.titleIsValid &&
    enteredData.dateIsValid &&
    enteredData.timeIsValid &&
    enteredData.groupIsValid;

  const submitHandler = (e) => {
    e.preventDefault();
    setFormIsTouched(true);

    if (!allRequiredIsValid || !formIsTouched) return;

    const newTask = {
      title: enteredData.title,
      date: enteredData.date,
      time: enteredData.time,
      group: enteredData.group,
      completed: false,
      description: enteredData.description,
    };

    const sendData = async () => {
      const response = !props.isEditting
        ? await fetch(
            `${DATABASE_URL}/${tasksCtx.profile.userID}/tasks.json?auth=${tasksCtx.token}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newTask),
            },
          )
        : await fetch(
            `${DATABASE_URL}/${tasksCtx.profile.userID}/tasks/${props.task.id}.json?auth=${tasksCtx.token}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newTask),
            },
          );
      const data = await response.json();

      return data;
    };

    (async () => {
      const { name } = await sendData();
      !props.isEditting &&
        tasksCtx.addTask({
          ...newTask,
          id: name,
        });

      props.isEditting &&
        tasksCtx.editTask({
          ...newTask,
          id: props.task.id,
        });
    })();

    props.onClose();
  };

  const titleChangeHandler = (e) => {
    dispatchEnteredData({ type: "TITLE", value: e.target.value });
  };
  const dateChangeHandler = (e) => {
    dispatchEnteredData({ type: "DATE", value: e.target.value });
  };
  const timeChangeHandler = (e) => {
    dispatchEnteredData({ type: "TIME", value: e.target.value });
  };
  const descriptionChangeHandler = (e) => {
    dispatchEnteredData({ type: "DESCRIPTION", value: e.target.value });
  };
  const tagChangeHandler = (e) => {
    dispatchEnteredData({ type: "TAG", value: e.target.value });
  };

  return (
    <div className={styles.container} onSubmit={submitHandler}>
      <form className={styles.form}>
        <div className={styles.actions}>
          <button
            className={styles.cancel}
            type="button"
            onClick={props.onCancel}
          >
            Cancel
          </button>
          <button className={styles.add}>
            {props.isEditting ? "Save" : "Add"}
          </button>
        </div>
        <div
          className={`${styles.input} ${!enteredData.titleIsValid && formIsTouched ? styles.invalid : ""}`}
        >
          <label htmlFor="title">
            Title<span>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={enteredData.title}
            onChange={titleChangeHandler}
          />
        </div>
        <div
          className={`${styles.input} ${!enteredData.dateIsValid && enteredData.titleIsValid && formIsTouched ? styles.invalid : ""}`}
        >
          <label htmlFor="date">
            Date<span>*</span>
          </label>
          <input
            type="date"
            id="date"
            min={"2024-01-01"}
            value={enteredData.date}
            onChange={dateChangeHandler}
          />
        </div>
        {enteredData.dateIsValid && (
          <div
            className={`${styles.input} ${!enteredData.timeIsValid && formIsTouched ? styles.invalid : ""}`}
          >
            <label htmlFor="time">
              Time<span>*</span>
            </label>
            <input
              type="time"
              id="time"
              value={enteredData.time}
              onChange={timeChangeHandler}
            />
          </div>
        )}
        <div className={styles.textarea}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={enteredData.description}
            onChange={descriptionChangeHandler}
          ></textarea>
        </div>

        <div className={styles["tags-container"]}>
          <h2>Tags</h2>
          <div className={styles.tags}>
            <input
              type="radio"
              value={"work"}
              id="work"
              name="tag"
              checked={enteredData.group === "work"}
              onChange={tagChangeHandler}
            />
            <label htmlFor="work">
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="-25 -25 50 50"
                >
                  <circle x={25} y={25} r={18} fill={ICON_COLORS.work}></circle>
                </svg>
              </div>
              <div className={styles.title}>Work</div>
            </label>

            <input
              type="radio"
              value={"family"}
              id="family"
              name="tag"
              checked={enteredData.group === "family"}
              onChange={tagChangeHandler}
            />
            <label htmlFor="family">
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="-25 -25 50 50"
                >
                  <circle
                    x={25}
                    y={25}
                    r={18}
                    fill={ICON_COLORS.family}
                  ></circle>
                </svg>
              </div>
              <div className={styles.title}>Family</div>
            </label>

            <input
              type="radio"
              value={"study"}
              id="study"
              name="tag"
              checked={enteredData.group === "study"}
              onChange={tagChangeHandler}
            />
            <label htmlFor="study">
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="-25 -25 50 50"
                >
                  <circle
                    x={25}
                    y={25}
                    r={18}
                    fill={ICON_COLORS.study}
                  ></circle>
                </svg>
              </div>
              <div className={styles.title}>Study</div>
            </label>

            <input
              type="radio"
              value={"entertainment"}
              id="entertainment"
              name="tag"
              checked={enteredData.group === "entertainment"}
              onChange={tagChangeHandler}
            />
            <label htmlFor="entertainment">
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="-25 -25 50 50"
                >
                  <circle
                    x={25}
                    y={25}
                    r={18}
                    fill={ICON_COLORS.entertainment}
                  ></circle>
                </svg>
              </div>
              <div className={styles.title}>Entertainment</div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTask;
