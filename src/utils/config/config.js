const ICON_COLORS = {
  work: "#99f575",
  study: "#510080",
  entertainment: "#e2c7cc",
  family: "#3fdfaf",
};

const DATABASE_URL = "https://todo-app-b21cb-default-rtdb.firebaseio.com";

const UPDATE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:update?key=";

const USER_PROFILE_DATA_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=";

const SIGN_UP_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

const SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

const PASSWORD_CHANGE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:update?key=";

export {
  ICON_COLORS,
  DATABASE_URL,
  UPDATE_URL,
  USER_PROFILE_DATA_URL,
  SIGN_UP_URL,
  SIGN_IN_URL,
  PASSWORD_CHANGE_URL,
};
