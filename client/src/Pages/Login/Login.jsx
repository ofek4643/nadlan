import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>התחברות</h3>
          <p className={styles.subtitle}>ברוכים הבאים חזרה לנדל"ן ישראלי</p>
        </div>
        <form className={styles.formGroup} action="">
          <div className={styles.formGroup}>
            <label id="labelUsername" htmlFor="username">
              שם משתמש
            </label>
            <input
              id="username"
              type="text"
              placeholder="הזן שם משתמש"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label id="labelPassword" htmlFor="password">
              סיסמה
            </label>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                type={show ? "text" : "password"}
                placeholder="הזן סיסמה"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button"
                onClick={() => setShow(show ? false : true)}
                className={styles.showBtn}
              >
                {show ? "הסתר" : "הצג"}
              </button>
            </div>
          </div>

          <div className={styles.options}>
            <label>
              <input type="checkbox" />
              זכור אותי
            </label>
            <Link to="/forgot-password" className={styles.link}>
              שכחת סיסמה?
            </Link>
          </div>

          <button
            onClick={onSubmit}
            type="submit"
            disabled={password === "" || username === ""}
            className={styles.loginBtn}
          >
            התחבר
          </button>
        </form>

        <p className={styles.register}>
          אין לך חשבון עדיין? <Link to="/register">הירשם כעת</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
