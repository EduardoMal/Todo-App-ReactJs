import { useContext } from "react";
import CommonTasksContent from "./CommonTasksContent";
import TasksStore from "../store/tasks-store";

const Family = function () {
  const tasksCtx = useContext(TasksStore);

  return (
    <CommonTasksContent
      tasks={tasksCtx.tasks.filter((task) => task.group === "family")}
    />
  );
};

export default Family;
