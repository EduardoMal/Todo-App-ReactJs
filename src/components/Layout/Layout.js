import Header from "./Header";

import styles from "./Layout.module.css";

const Layout = function (props) {
  return (
    <div className={styles.layout}>
      <Header onClick={props.onToggleModal} />
      <main className={styles.main}>{props.children}</main>
    </div>
  );
};

export default Layout;
