import styles from "./HighlightedTask.module.css";

const HighlightedTask = function (props) {
  const { task } = props;

  return (
    <div className={styles.container}>
      <header className={styles.title}>{task.title}</header>
      <p>{task.description}</p>
      <span>Due Date: {task.date}</span>
      <span>Time: {task.time}</span>
      <span>Status: {task.completed ? "Completed" : "Pending"}</span>
      <span>Category: {task.group[0].toUpperCase() + task.group.slice(1)}</span>
      <div className={styles.actions}>
        <button onClick={props.onEdit} type="button" className={styles.edit}>
          Edit
        </button>
        <button
          onClick={props.onDelete}
          type="button"
          className={styles.delete}
        >
          Delete
        </button>
        <button onClick={props.onClose} type="button" className={styles.close}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HighlightedTask;
