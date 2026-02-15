import { Fragment } from "react/jsx-runtime";
import { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Overlay from "./components/UI/Overlay";
import NewTask from "./components/NewTask/NewTask";
import AllTasks from "./pages/AllTasks";
import Work from "./pages/Work";
import Family from "./pages/Family";
import Study from "./pages/Study";
import Entertainment from "./pages/Entertainment";
import TasksStore from "./store/tasks-store";
import ErrorModal from "./components/UI/ErrorModal";
import TaskDetails from "./pages/TaskDetails";

import ProfilePage from "./pages/ProfilePage";
import NewPasswordPage from "./pages/NewPasswordPage";
import NewProfilePage from "./pages/NewProfilePage";
import AuthPage from "./pages/AuthPage";
import useGETMethod from "./hooks/useGETMethod";
import { DATABASE_URL } from "./utils/config/config";

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
      </Layout>
    </Fragment>
  );
}

export default App;
