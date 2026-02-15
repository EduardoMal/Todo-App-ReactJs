import style from "./ErrorModal.module.css";

const ErrorModal = function (props) {
  return (
    <div className={style.error}>
      <header>Error</header>
      <p>{props.text}</p>
    </div>
  );
};

export default ErrorModal;
