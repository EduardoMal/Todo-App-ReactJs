const createNotification = (task) => {
  const notification = new Notification(task.title, {
    tag: task.group,
    icon: "../icons/todoIcon.jpeg",
    body: "The task is due.",
  });

  notification.addEventListener("click", () => {
    window.open(`http://localhost:3000`, "_blank");
  });
  notification.addEventListener("error", (e) => {
    console.log(e);
  });
};

export { createNotification };
