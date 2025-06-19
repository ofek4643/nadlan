import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

const Header = () => {
  const [alertActive, setAlertActive] = useState(false);
  const ref = useRef();

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setAlertActive(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/">
          <h2 className={styles.logo}>נדל"ן ישראלי</h2>
        </Link>
        <ul className={styles.navList}>
          <Link to="/">דף הבית</Link>
          <Link to="properties">חיפוש נכסים</Link>
          <Link to="add-property">פרסם נכס</Link>
          <Link to="mortgage-calculator">מחשבון משכנתא</Link>
        </ul>
        <div className={styles.authButtons}>
          <Link to="login">
            <button className={styles.LoginBtn}>התחברות</button>
          </Link>
          <Link to="register">
            <button className={styles.RegisterBtn}>הרשמה</button>
          </Link>
          <Link to="my-profile">
            <button className={styles.RegisterBtn}>פרופיל שלי</button>
          </Link>
        </div>
        {/* <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setAlertActive((prev) => !prev)}
            className={styles.alertButton}
          >
            <i className="fa-solid fa-bell"></i>
          </button>
          {alertActive && (
            <div ref={ref} className={styles.alertDiv}>
              <h2>התראות</h2>
              <p>אין התראות חדשות</p>
            </div>
          )} */}
      </div>
    </header>
  );
};
export default Header;
