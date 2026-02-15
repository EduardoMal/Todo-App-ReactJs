const formatDate = (date) =>
  new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);

const filterTasks = (tasks, time = "today") => {
  if (time.toLocaleLowerCase() === "completed")
    return tasks.filter((task) => task.completed);

  if (time.toLocaleLowerCase() === "upcoming")
    return tasks.filter((task) => {
      const now = new Date(task.date + " " + task.time);
      return (
        (now.getTime() - Date.now()) / (1000 * 60 * 60) > 24 && !task.completed
      );
    });

  if (time.toLocaleLowerCase() === "tomorrow")
    return tasks.filter((task) => {
      const now = new Date(task.date + " " + task.time);
      return (
        (now.getTime() - Date.now()) / (1000 * 60 * 60) <= 24 &&
        now.getTime() > Date.now() &&
        now.getDay() !== new Date().getDay() &&
        !task.completed
      );
    });

  if (time.toLocaleLowerCase() === "overdue")
    return tasks.filter((task) => {
      const now = new Date(task.date + " " + task.time);
      return now.getTime() < Date.now() && !task.completed;
    });

  return tasks.filter((task) => {
    const now = new Date(task.date + " " + task.time);
    return (
      now.getDate() === new Date(Date.now()).getDate() &&
      now.getMonth() === new Date(Date.now()).getMonth() &&
      now.getFullYear() === new Date(Date.now()).getFullYear() &&
      now.getTime() > Date.now() &&
      !task.completed
    );
  });
};

export { formatDate, filterTasks };
