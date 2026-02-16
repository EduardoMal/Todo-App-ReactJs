import { useCallback, useEffect, useReducer } from "react";
import TasksStore from "../store/tasks-store";
import { calcRemainingTime } from "../utils/helpers/calculate";

let logoutTimer,
  taskTimers = {};

const tasksReducer = (state, action) => {
  if (action.type === "COMPLETE") {
    const selectedIndex = state.tasks.findIndex(
      (task) => task.id === action.value.taskId,
    );

    if (selectedIndex >= 0) {
      const newSelectedTaskState = {
        ...state.tasks[selectedIndex],
        completed: action.value.isCompleted,
      };

      state.tasks[selectedIndex] = newSelectedTaskState;
    }

    return { ...state, indicator: !state.indicator };
  }

  if (action.type === "REMOVE") {
    const newState = {
      ...state,
      tasks: state.tasks.filter((task) => task.id !== action.value.taskId),
      indicator: !state.indicator,
    };
    return newState;
  }

  if (action.type === "TRIGGER") {
    return { ...state, indicator: !state.indicator };
  }

  if (action.type === "SET") {
    const newState = {
      ...state,
      tasks: action.value.tasks,
      indicator: !state.indicator,
    };
    return newState;
  }

  if (action.type === "EDIT") {
    const selectedIndex = state.tasks.findIndex(
      (task) => task.id === action.value.task.id,
    );
    if (selectedIndex >= 0) {
      state.tasks[selectedIndex] = action.value.task;
    }

    return { ...state, indicator: !state.indicator };
  }

  if (action.type === "ADD") {
    const newState = {
      ...state,
      tasks: state.tasks.concat(action.value.task),
      indicator: !state.indicator,
    };

    return newState;
  }

  if (action.type === "LOGIN") {
    return {
      ...state,
      token: action.value.token,
      isLoggedIn: true,
      profile: { ...state.profile, ...action.value.profile },
    };
  }

  if (action.type === "LOGOUT") {
    return {
      ...state,
      token: "",
      isLoggedIn: false,
      profile: { displayName: "", email: "", photoUrl: "" },
    };
  }

  if (action.type === "PROFILE_UPDATE") {
    return { ...state, profile: { ...state.profile, ...action.value.data } };
  }

  return {
    profile: { displayName: "", email: "", photoUrl: "", userID: "" },
    token: "",
    isLoggedIn: false,
    tasks: [],
    indicator: false,
    notificationPermission: "default",
  };
};

const getStoredToken = () => {
  const todoDetails = JSON.parse(localStorage.getItem("todoDetails"));
  if (!todoDetails) return null;
  const remainingTime = calcRemainingTime(todoDetails.expirationTime);
  if (remainingTime <= 60000) {
    localStorage.removeItem("todoDetails");
    return null;
  }

  return {
    token: todoDetails.token,
    userID: todoDetails.userID,
    remainingTime,
  };
};

const TasksStoreProvider = function (props) {
  const todoData = getStoredToken();
  let token;
  let userID;
  if (todoData) {
    token = todoData.token;
    userID = todoData.userID;
  }

  const [tasks, dispatchTasks] = useReducer(tasksReducer, {
    profile: {
      displayName: "",
      email: "",
      photoUrl: "",
      userID: userID ? userID : "",
    },
    token: token ? token : "",
    isLoggedIn: !!token,
    tasks: [],
    indicator: false,
    notificationPermission: "default",
  });

  const addTaskHandler = (task) => {
    dispatchTasks({ type: "ADD", value: { task } });
  };
  const completeTaskHandler = (taskId, isCompleted) => {
    dispatchTasks({ type: "COMPLETE", value: { taskId, isCompleted } });
  };

  const setTasksHandler = useCallback((tasks) => {
    dispatchTasks({ type: "SET", value: { tasks } });
  }, []);

  const deleteTaskHandler = (taskId) => {
    dispatchTasks({ type: "REMOVE", value: { taskId } });
  };

  const editTaskHandler = (task) => {
    dispatchTasks({ type: "EDIT", value: { task } });
  };

  const logoutHandler = useCallback(() => {
    dispatchTasks({ type: "LOGOUT" });
    localStorage.removeItem("todoDetails");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime, profile) => {
    dispatchTasks({ type: "LOGIN", value: { token, profile } });

    localStorage.setItem(
      "todoDetails",
      JSON.stringify({
        token,
        expirationTime,
        userID: profile.userID,
      }),
    );

    const remainingTime = calcRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const profileUpdateHandler = useCallback((data) => {
    dispatchTasks({ type: "PROFILE_UPDATE", value: { data } });
  }, []);

  useEffect(() => {
    if (todoData) {
      logoutTimer = setTimeout(logoutHandler, todoData.remainingTime);
    }
  }, [todoData, logoutHandler]);

  tasks.tasks
    .filter((task) => calcRemainingTime(task.date + " " + task.time) >= 0)
    .forEach((task) => {
      const notificationTime = calcRemainingTime(task.date + " " + task.time);
      taskTimers[task.id] = setTimeout(() => {
        dispatchTasks({ type: "TRIGGER" });
      }, notificationTime + 2000);
    });

  return (
    <TasksStore.Provider
      value={{
        profile: tasks.profile,
        isLoggedIn: tasks.isLoggedIn,
        token: tasks.token,
        tasks: tasks.tasks,
        indicator: tasks.indicator,
        addTask: addTaskHandler,
        completeTask: completeTaskHandler,
        setTasks: setTasksHandler,
        deleteTask: deleteTaskHandler,
        editTask: editTaskHandler,
        login: loginHandler,
        logout: logoutHandler,
        updateProfile: profileUpdateHandler,
      }}
    >
      {props.children}
    </TasksStore.Provider>
  );
};

export default TasksStoreProvider;
