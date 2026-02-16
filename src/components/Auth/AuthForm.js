import { useRef, useState, useContext, Fragment } from "react";
import TasksStore from "../../store/tasks-store";
import ErrorModal from "../UI/ErrorModal";
import Overlay from "../UI/Overlay";
import {
  SIGN_IN_URL,
  SIGN_UP_URL,
  DATABASE_URL,
} from "../../utils/config/config";
import styles from "./AuthForm.module.css";
import useGETMethod from "../../hooks/useGETMethod";

const AuthForm = function (props) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const tasksCtx = useContext(TasksStore);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

  const url = `${DATABASE_URL}/${tasksCtx.profile.userID}/tasks.json?auth=${tasksCtx.token}`;

  useGETMethod(url);
  const emailRef = useRef();
  const passwordRef = useRef();

  const modeSwitchHandler = () => {
    setIsLogin((init) => !init);
  };

  const backdropCloseHandler = () => {
    setIsOpenBackdrop(false);
    setError(null);
  };

  const authHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    let url;
    if (isLogin) {
      url = `${SIGN_IN_URL}${API_KEY}`;
    } else {
      url = `${SIGN_UP_URL}${API_KEY}`;
    }

    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setIsLoading(false);
          const data = await response.json();
          let errorMessage;
          if (data && data.error.message) {
            errorMessage = `${data.error.code}: ${data.error.message}`;
            throw new Error(errorMessage);
          } else {
            errorMessage = "An error ocurred.";
            throw new Error(errorMessage);
          }
        } else {
          setIsLoading(false);
          const data = await response.json();
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000,
          ).toISOString();

          tasksCtx.login(data.idToken, expirationTime, {
            email: data.email,
            userID: data.localId,
          });
        }
      } catch (error) {
        setIsOpenBackdrop(true);
        setError(error.message);
      }
    };

    sendRequest();
  };

  if (error) {
    return (
      <Fragment>
        {isOpenBackdrop && <Overlay onClick={backdropCloseHandler} />}
        {isOpenBackdrop && <ErrorModal text={error} />}
      </Fragment>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={authHandler}>
        <div className={styles.input}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailRef} required />
        </div>
        <div className={styles.input}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordRef} required />
        </div>
        <div className={styles.actions}>
          {!isLoading && (
            <button type="submit" className={styles.submit}>
              {isLogin ? "Login" : "Sign Up"}
            </button>
          )}
          {isLoading && (
            <button type="submit" className={styles.submit}>
              Sending Request...
            </button>
          )}
          <button
            type="button"
            onClick={modeSwitchHandler}
            className={styles["btn-switch"]}
          >
            {isLogin ? "Create new account" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
