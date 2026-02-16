import { Fragment } from "react/jsx-runtime";
import React, { useState, useContext, Suspense } from "react";
import ReactDOM from "react-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import useGETMethod from "./hooks/useGETMethod";
import TasksStore from "./store/tasks-store";
import { DATABASE_URL } from "./utils/config/config";

const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const NewProfilePage = React.lazy(() => import("./pages/NewProfilePage"));
const NewPasswordPage = React.lazy(() => import("./pages/NewPasswordPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const Overlay = React.lazy(() => import("./components/UI/Overlay"));
const NewTask = React.lazy(() => import("./components/NewTask/NewTask"));
const AllTasks = React.lazy(() => import("./pages/AllTasks"));
const Work = React.lazy(() => import("./pages/Work"));
const Study = React.lazy(() => import("./pages/Study"));
const Entertainment = React.lazy(() => import("./pages/Entertainment"));
const Family = React.lazy(() => import("./pages/Family"));
const ErrorModal = React.lazy(() => import("./components/UI/ErrorModal"));
const TaskDetails = React.lazy(() => import("./pages/TaskDetails"));

function App() {
  const [isOverlayed, setIsOverlayed] = useState(false);
  const tasksCtx = useContext(TasksStore);
  const url = `${DATABASE_URL}/${tasksCtx.profile.userID}/tasks.json?auth=${tasksCtx.token}`;
  const { responseData: data } = useGETMethod(url);

  // useEffect(() => {
  //
  // }, [setTasks, userID]);

  const overleyCloseHandler = () => {
    setIsOverlayed(false);
  };

  const modalHandler = () => {
    setIsOverlayed(true);
  };

  if (data.err) {
    return <ErrorModal text={data.err} />;
  }

  return (
    <Fragment>
      <Layout onToggleModal={modalHandler}>
        <Suspense fallback={<p>Loading...</p>}>
          {isOverlayed &&
            ReactDOM.createPortal(
              <Overlay onClick={overleyCloseHandler} />,
              document.getElementById("overlay"),
            )}
          {isOverlayed &&
            ReactDOM.createPortal(
              <NewTask
                onCancel={overleyCloseHandler}
                onClose={overleyCloseHandler}
              />,
              document.getElementById("overlay"),
            )}

          <Routes>
            {tasksCtx.isLoggedIn && (
              <Route path="/all-tasks" element={<AllTasks />}></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route path="/family" element={<Family />}></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route path="/entertainment" element={<Entertainment />}></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route path="/study" element={<Study />}></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route path="/work" element={<Work />}></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route path="/profile" element={<ProfilePage />}>
                <Route path="password" element={<NewPasswordPage />}></Route>
                <Route path="update" element={<NewProfilePage />}></Route>
              </Route>
            )}
            {!tasksCtx.isLoggedIn && (
              <Route path="/auth" element={<AuthPage />}></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route
                path={`/task-details/:taskId`}
                element={<TaskDetails />}
              ></Route>
            )}
            {tasksCtx.isLoggedIn && (
              <Route path="*" element={<Navigate replace to="/all-tasks" />} />
            )}
            {!tasksCtx.isLoggedIn && (
              <Route path="*" element={<Navigate replace to="/auth" />} />
            )}
          </Routes>
        </Suspense>
      </Layout>
    </Fragment>
  );
}

export default App;
