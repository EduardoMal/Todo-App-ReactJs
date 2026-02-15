import { Fragment, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import HighlightedTask from "../components/Tasks/HighlightedTask";
import TasksStore from "../store/tasks-store";
import Tasks from "../components/Tasks/Tasks";
import MainTaskSection from "../components/Layout/MainTaskSection";
import Backdrop from "../components/UI/Backdrop";
import Overlay from "../components/UI/Overlay";
import ErrorModal from "../components/UI/ErrorModal";
import NewTask from "../components/NewTask/NewTask";
import { DATABASE_URL } from "../utils/config/config";
import Navigation from "../components/Layout/Navigation";

const TaskDetails = () => {
  const tasksCtx = useContext(TasksStore);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isEditting, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const navigate = useNavigate();
  const { taskId } = params;
  const task = tasksCtx.tasks.find((task) => task.id === taskId);

  const detailsCloseHandler = () => {
    navigate(-1, { replace: true });
  };

  const taskDeleteHandler = () => {
    setIsConfirmed(true);
  };
  const taskEditHandler = () => {
    setIsEditing(true);
  };

  const closeModalHandler = () => {
    setIsConfirmed(false);
  };

  const confirmDeleteHandler = () => {
    const sendRequest = async () => {
      const response = await fetch(
        `${DATABASE_URL}/${tasksCtx.profile.userID}/tasks/${taskId}.json?auth=${tasksCtx.token}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Could not delete the task.");
    };
    sendRequest().catch((err) => {
      setError(err.message);
    });

    tasksCtx.deleteTask(taskId);
    setIsConfirmed(false);
    navigate(-1, { replace: true });
  };

  if (!task) {
    return (
      <Fragment>
        <Navigation />
        <Tasks>
          <MainTaskSection>
            <p style={{ textAlign: "center" }}>Task not found.</p>
          </MainTaskSection>
        </Tasks>
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        <Overlay onClick={detailsCloseHandler} />
        <ErrorModal text={error} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Navigation />
      <Tasks>
        {isConfirmed && <Overlay onClick={closeModalHandler} />}
        {isConfirmed && (
          <Backdrop
            message="Are you sure you want to delete?"
            action="Delete"
            onClose={closeModalHandler}
            onDelete={confirmDeleteHandler}
          />
        )}
        {isEditting && <Overlay onClick={detailsCloseHandler} />}
        {isEditting && (
          <NewTask
            onClose={detailsCloseHandler}
            onCancel={detailsCloseHandler}
            isEditting={true}
            task={task}
          />
        )}
        <MainTaskSection>
          <HighlightedTask
            task={task}
            onClose={detailsCloseHandler}
            onDelete={taskDeleteHandler}
            onEdit={taskEditHandler}
          />
        </MainTaskSection>
      </Tasks>
    </Fragment>
  );
};

export default TaskDetails;
