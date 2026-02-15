import { useContext, useEffect, useReducer } from "react";
import TasksStore from "../store/tasks-store";

const httpReducer = (state, action) => {
  if (action.type === "ERROR") {
    return { ...state, err: action.err };
  }
  if (action.type === "DATA") {
    return { ...state, data: action.data };
  }
  return { data: null, err: null };
};

const useGETMethod = function (url) {
  const [respData, dispatchRespData] = useReducer(httpReducer, {
    data: null,
    err: null,
  });

  const tasksCtx = useContext(TasksStore);
  const {
    setTasks,
    profile: { userID },
    isLoggedIn,
  } = tasksCtx;

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            let errorMessage = "Something went wrong.";
            const data = await response.json();
            if (data && data.error.message) {
              errorMessage = `${data.error.code}: ${data.error.message}`;
            }
            throw new Error(errorMessage);
          } else {
            const data = await response.json();
            const tasksArr = [];
            for (const key in data) {
              tasksArr.push({ ...data[key], id: key });
            }
            setTasks(tasksArr);
            dispatchRespData({ type: "DATA", data: data });
          }
        } catch (error) {
          console.log(error);

          dispatchRespData({ type: "ERROR", err: error.message });
        }
      })();
    }
  }, [userID, setTasks, url, isLoggedIn]);
  return { responseData: respData, dispatchResponseData: dispatchRespData };
};

export default useGETMethod;
