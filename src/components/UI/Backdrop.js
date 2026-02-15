import styles from "./Backdrop.module.css";

const Backdrop = (props) => {
  return (
    <div className={styles.backdrop}>
      <p>{props.message}</p>
      <div className={styles.actions}>
        <button onClick={props.onClose} className={styles.cancel}>
          Cancel
        </button>
        <button onClick={props.onDelete} className={styles.confirm}>
          {props.action}
        </button>
      </div>
    </div>
  );
};

export default Backdrop;
