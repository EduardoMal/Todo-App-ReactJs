import { Fragment, useContext, useEffect, useState } from "react";
import Tasks from "../components/Tasks/Tasks";
import MainTaskSection from "../components/Layout/MainTaskSection";
import TasksList from "../components/Tasks/TasksList";
import TasksStore from "../store/tasks-store";
import { ICON_COLORS } from "../utils/config/config";
import { filterTasks } from "../utils/helpers/format";
import { DATABASE_URL } from "../utils/config/config";
import Navigation from "../components/Layout/Navigation";

const CommonTasksContent = function (props) {
  const { tasks } = props;
  const tasksCtx = useContext(TasksStore);
  const [todaysTasks, setTodaysTasks] = useState(filterTasks(tasks));
  const [overdueTasks, setOverdueTasks] = useState(
    filterTasks(tasks, "overdue"),
  );
  const [tomorrowsTasks, setTomorrowsTasks] = useState(
    filterTasks(tasks, "tomorrow"),
  );
  const [upcomingTasks, setUpcomingTasks] = useState(
    filterTasks(tasks, "upcoming"),
  );
  const [completedTasks, setCompletedTasks] = useState(
    filterTasks(tasks, "completed"),
  );

  const { indicator } = tasksCtx;

  const completeTaskHandler = async (id, isCompleted) => {
    const task = tasks.find((task) => task.id === id);
    tasksCtx.completeTask(id, isCompleted);

    try {
      const request = await fetch(
        `${DATABASE_URL}/${tasksCtx.profile.userID}/tasks/${id}.json?auth=${tasksCtx.token}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...task,
            completed: isCompleted,
          }),
        },
      );

      if (!request.ok) {
        throw new Error("Could not update the task.");
      }
    } catch (error) {}
  };

  useEffect(() => {
    setOverdueTasks(filterTasks(tasks, "overdue"));
    setTodaysTasks(filterTasks(tasks));
    setTomorrowsTasks(filterTasks(tasks, "tomorrow"));
    setUpcomingTasks(filterTasks(tasks, "upcoming"));
    setCompletedTasks(filterTasks(tasks, "completed"));
  }, [tasks, indicator]);

  if (
    [...overdueTasks, ...todaysTasks, ...tomorrowsTasks, ...upcomingTasks]
      .length === 0 &&
    tasks.length > 0
  ) {
    return (
      <Fragment>
        <Navigation />
        <Tasks>
          <MainTaskSection>
            <h2 style={{ textAlign: "center" }}>No pending tasks.</h2>
          </MainTaskSection>
          <MainTaskSection>
            {completedTasks.length > 0 && (
              <TasksList
                title="Completed Tasks"
                tasks={completedTasks}
                iconColors={ICON_COLORS}
                onCompleted={completeTaskHandler}
              />
            )}
          </MainTaskSection>
        </Tasks>
      </Fragment>
    );
  }

  if (tasks.length === 0) {
    return (
      <Fragment>
        <Navigation />
        <Tasks>
          <MainTaskSection>
            <p style={{ textAlign: "center" }}>No tasks found.</p>
          </MainTaskSection>
        </Tasks>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Navigation />
      <Tasks>
        <MainTaskSection>
          {overdueTasks.length > 0 && (
            <TasksList
              title="Overdue"
              className="overdue"
              tasks={overdueTasks}
              onCompleted={completeTaskHandler}
              iconColors={ICON_COLORS}
            />
          )}
          {todaysTasks.length > 0 && (
            <TasksList
              title="Today"
              tasks={todaysTasks}
              iconColors={ICON_COLORS}
              onCompleted={completeTaskHandler}
            />
          )}
          {tomorrowsTasks.length > 0 && (
            <TasksList
              title="Tomorrow"
              tasks={tomorrowsTasks}
              iconColors={ICON_COLORS}
              onCompleted={completeTaskHandler}
            />
          )}
          {upcomingTasks.length > 0 && (
            <TasksList
              title="Upcoming"
              tasks={upcomingTasks}
              iconColors={ICON_COLORS}
              onCompleted={completeTaskHandler}
            />
          )}
        </MainTaskSection>
        <MainTaskSection>
          {completedTasks.length > 0 && (
            <TasksList
              title="Completed Tasks"
              tasks={completedTasks}
              iconColors={ICON_COLORS}
              onCompleted={completeTaskHandler}
            />
          )}
        </MainTaskSection>
      </Tasks>
    </Fragment>
  );
};

export default CommonTasksContent;
