import { useContext } from "react";
import CommonTasksContent from "./CommonTasksContent";
import TasksStore from "../store/tasks-store";

const Study = function () {
  const tasksCtx = useContext(TasksStore);

  return (
    <CommonTasksContent
      tasks={tasksCtx.tasks.filter((task) => task.group === "study")}
    />
  );
};

export default Study;
