import React from "react";

const TasksStore = React.createContext({
  indicator: false,
  tasks: [],
  token: "",
  isLoggedIn: false,
  notificationPermission: false,
  profile: { displayName: "", email: "", photoUrl: "", userID: "" },
  addTask: (task) => {},
  completeTask: (taskId, isCompleted) => {},
  deleteTask: (taskId) => {},
  setTasks: (tasks) => {},
  editTask: (task) => {},
  login: (token, expirationTime) => {},
  logout: () => {},
  setProfile: (data) => {},
  updateProfile: (data) => {},
  requestNotificationPermission: () => {},
  showNotification: () => {},
});

export default TasksStore;
