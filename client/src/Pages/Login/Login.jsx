import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import CustomInput from "../../components/CustomInput/CustomInput";
import axios from "axios";
import { useAuth } from "../../data/AuthContext";

const Login = () => {
  // משתנים של התחברות
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [show, setShow] = useState(false);
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  // בדיקה ראשונית אם השדות תקינים
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmited(true);
    let hasErrors = false;
    if (userName === "") {
      setUserNameError(true);
      hasErrors = true;
    }
    if (password === "") {
      setPasswordError(true);
      hasErrors = true;
    }
    if (hasErrors) {
      setShowMessageVisibilty(false);
      setTimeout(() => {
        setShowMessage("יש למלא את כל השדות בצורה תקינה");
        setShowMessageVisibilty(true);
      }, 10);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);

      return;
    }
    // אם כן בודק האם יש יוזר במסד נתונים 
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/login",
        {
          userName,
          password,
          rememberMe,
        },
        { withCredentials: true }
      );
      console.log("התגובה מהשרת:", res.data);
      await fetchUser();
      navigate("/", { state: { showMessage: res.data.message } });
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
      setLoading(false);
      setShowMessageVisibilty(false);
      setTimeout(() => {
        setShowMessageVisibilty(true);
      }, 10);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);
    }
  };
  // בדיקה בזמן אמת עם השדות תקינים
  useEffect(() => {
    if (submited) {
      if (userName !== "") {
        setUserNameError(false);
      } else {
        setUserNameError(true);
      }
      if (password !== "") {
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    }
  }, [submited, userName, password]);

  return (
    <div className={styles.wrapper}>
      {showMessageVisibilty && (
        <div
          className={
            showMessage.includes("הצלחה")
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {showMessage}
        </div>
      )}
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
            <CustomInput
              id="username"
              type="text"
              placeholder="הזן שם משתמש"
              onChange={(e) => setUserName(e.target.value)}
            />
            <div className={styles.error}>
              {userNameError && (
                <div className={styles.errorText}>שם משתמש הוא שדה חובה</div>
              )}
            </div>
            <label id="labelPassword" htmlFor="password">
              סיסמה
            </label>
            <div className={styles.passwordContainer}>
              <CustomInput
                id="password"
                type={show ? "text" : "password"}
                placeholder="הזן סיסמה"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />

              <button
                type="button"
                onClick={() => setShow(show ? false : true)}
                className={styles.showBtn}
              >
                {show ? "הסתר" : "הצג"}
              </button>
            </div>
            <div className={styles.error}>
              {passwordError && (
                <div className={styles.errorText}>סיסמא הוא שדה חובה</div>
              )}
            </div>
          </div>

          <div className={styles.options}>
            <label>
              <CustomInput
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              זכור אותי
            </label>
            <Link to="/forgot-password" className={styles.link}>
              שכחת סיסמה?
            </Link>
          </div>

          <button
            onClick={onSubmit}
            type="submit"
            className={loading ? styles.loginBtnLoading : styles.loginBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>מתחבר...</span>
                <span className={styles.loadingSpinner}></span>
              </>
            ) : (
              "התחבר"
            )}
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
