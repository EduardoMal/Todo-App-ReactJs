import { Fragment, useContext } from "react";
import CommonTasksContent from "./CommonTasksContent";
import TasksStore from "../store/tasks-store";

const AllTasks = function () {
  const tasksCtx = useContext(TasksStore);

  return (
    <Fragment>
      <CommonTasksContent tasks={tasksCtx.tasks} />
    </Fragment>
  );
};

export default AllTasks;
