import { useContext } from "react";
import CommonTasksContent from "./CommonTasksContent";
import TasksStore from "../store/tasks-store";

const Work = function () {
  const tasksCtx = useContext(TasksStore);

  return (
    <CommonTasksContent
      tasks={tasksCtx.tasks.filter((task) => task.group === "work")}
    />
  );
};

export default Work;
