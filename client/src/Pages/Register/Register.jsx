import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { Link } from "react-router-dom";
import { labelStyle } from "../../data/data.js";
import { useAuth } from "../../data/AuthContext.jsx";
import { registerGuest } from "../../api/users.js";
// דרישות סיסמא
const requirements = [
  {
    id: "length",
    regex: /.{8,}/,
    message: "תשתמש ב8 תווים לפחות",
  },
  {
    id: "uppercase",
    regex: /[A-Z]/,
    message: "תשתמש באות גדולה אחת לפחות",
  },
  {
    id: "lowercase",
    regex: /[a-z]/,
    message: "תשתמש באות קטנה אחת לפחות",
  },
  { id: "number", regex: /\d/, message: "תשתמש במספר אחד לפחות" },
  {
    id: "special",
    regex: /(?=[^\p{L}\p{N}\p{Emoji}])/u,
    message: "תשתמש בתו מיוחד אחד לפחות (! @ # )",
  },
];

const Register = () => {
  // משתנים של התחברות
  const [submited, setSubmited] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [accept, setAccept] = useState(false);

  // בדיקת סיסמא
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);

  // הודעות שגיאה של השדות
  const [fullNameError, setFullNameError] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [acceptError, setAcceptError] = useState(false);
  // הודעות
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const timeoutRef = useRef(null);
  // טעינה
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  // בודק את החוזק הסיסמא המוזנת בזמן אמת
  useEffect(() => {
    const checks = requirements.map((req) => ({
      ...req,
      passed: req.regex.test(password),
    }));
    setResults(checks);
    setScore(checks.filter((c) => c.passed).length);
  }, [password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmited(true);
    // בדיקת ראשונית של שדות
    let hasErrors = false;

    if (
      fullName.trim().length <= 3 ||
      fullName
        .trim()
        .split(" ")
        .filter((w) => w.length > 0).length < 2
    ) {
      setFullNameError(true);
      hasErrors = true;
    }
    if (userName.length <= 7) {
      setUserNameError(true);
      hasErrors = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
      setEmailError(true);
      hasErrors = true;
    }
    if (phoneNumber.length < 9) {
      setPhoneNumberError(true);
      hasErrors = true;
    }
    if (password !== confirmPassword || password === "") {
      setConfirmPasswordError(true);
      hasErrors = true;
    }
    if (score !== 5) {
      setPasswordError(true);
      hasErrors = true;
    }
    if (accept === false) {
      setAcceptError(true);
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
    // שליחת נתונים לשרת בשביל שירשם
    try {
      setLoading(true);
      const dataRegister = { fullName, userName, email, phoneNumber, password };
      const res = await registerGuest(dataRegister);
      console.log("התגובה מהשרת:", res.data.message);
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
  // בדיקה בזמן אמת את השדות
  useEffect(() => {
    if (submited) {
      if (
        fullName.trim().length > 3 &&
        fullName
          .trim()
          .split(" ")
          .filter((w) => w.length > 0).length >= 2
      ) {
        setFullNameError(false);
      } else {
        setFullNameError(true);
      }
      if (userName.length > 7) {
        setUserNameError(false);
      } else {
        setUserNameError(true);
      }
      if (/^[^\s@]+@[^\s@]+\.(com|co\.il)$/i.test(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
      if (phoneNumber.length >= 10) {
        setPhoneNumberError(false);
      } else {
        setPhoneNumberError(true);
      }
      if (score >= 5) {
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
      if (password === confirmPassword && password !== "") {
        setConfirmPasswordError(false);
      } else {
        setConfirmPasswordError(true);
      }
      if (accept === true) {
        setAcceptError(false);
      }
    }
  }, [
    fullName,
    userName,
    email,
    submited,
    phoneNumber,
    score,
    password,
    confirmPassword,
    accept,
  ]);
  // הגדרת נראות חוזק סיסמא
  const strengthLabel = ["", "חלש", "בינונית", "חזקה"];
  const strengthColor = ["gray", "red", "orange", "green"];
  const strengthIndex = score === 0 ? 0 : score <= 2 ? 1 : score <= 4 ? 2 : 3;

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
          <h3 className={styles.title}>הרשמה</h3>
          <p className={styles.subtitle}>הצטרף למערכת הנדל"ן המובילה בישראל</p>
        </div>

        <form action="">
          <div className={styles.formgroup}>
            <div className={styles.field}>
              <label style={labelStyle(fullNameError)}>שם מלא</label>
              <CustomInput
                type="text"
                placeholder="הזן שם מלא"
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className={styles.error}>
                {fullNameError && (
                  <div className={styles.errorText}>
                    שם מלא חייב להכיל לפחות 4 תווים ושני מילים
                  </div>
                )}
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <label style={labelStyle(userNameError)}>שם משתמש</label>
                <CustomInput
                  type="text"
                  placeholder="הזן שם משתמש"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <div className={styles.error}>
                  {userNameError && (
                    <div className={styles.errorText}>
                      שם משתמש חייב להכיל לפחות 8 תווים
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={labelStyle(emailError)}>אימייל</label>
                <CustomInput
                  type="email"
                  placeholder="your@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className={styles.error}>
                  {emailError && (
                    <div className={styles.errorText}>
                      כתובת אימייל לא תקינה
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label style={labelStyle(phoneNumberError)}>מספר טלפון</label>
              <CustomInput
                type="tel"
                placeholder="0501234567"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyDown={(e) => {
                  const allowed = [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "Backspace",
                  ];
                  if (!allowed.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <div className={styles.error}>
                {phoneNumberError && (
                  <div className={styles.errorText}>מספר טלפון לא תקין</div>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label>כתובת</label>
              <CustomInput
                type="text"
                autoComplete="address"
                placeholder="עיר, רחוב ומספר"
              />
            </div>

            <div className={styles.row}>
              <div>
                <label style={labelStyle(passwordError)}>סיסמה</label>
                <CustomInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="הזן סיסמה"
                />
                <div className={styles.error}>
                  {passwordError && (
                    <div className={styles.errorText}>
                      סיסמה חייבת להיות ברמה חזקה
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={labelStyle(confirmPasswordError)}>
                  אימות סיסמה
                </label>
                <CustomInput
                  value={confirmPassword}
                  type={show ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="הזן שוב סיסמה"
                />
                <div className={styles.error}>
                  {confirmPasswordError && (
                    <div className={styles.errorText}>סיסמאות לא תואמות</div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.containerReq}>
              <ul>
                {results.map((req) => (
                  <li
                    className={styles.listResult}
                    key={req.id}
                    style={{ color: req.passed ? "green" : "red" }}
                  >
                    {req.passed ? "✔️" : "❌"} {req.message}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 20 }}>
                חוזק הסיסמא: <strong>{strengthLabel[strengthIndex]}</strong>
              </div>
              <div
                style={{
                  marginTop: 10,
                  height: 15,
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: `${(score / 5) * 100}%`,
                    height: "100%",
                    backgroundColor: strengthColor[strengthIndex],
                    borderRadius: 10,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
            <div className={styles.showPass}>
              <button
                onClick={() => setShow(show ? false : true)}
                className={styles.buttonShowPassword}
                type="button"
              >
                {show ? "הסתר" : "הצג"} סיסמאות
              </button>
            </div>

            <div className={styles.agreement}>
              <CustomInput
                className={styles.checkBox}
                type="checkbox"
                onClick={() => setAccept(accept ? false : true)}
              />
              <p className={styles.agreementInfo}>
                אני מאשר את <Link to="/terms">תנאי השימוש</Link> ו
                <Link to="/privacy">מדיניות הפרטיות</Link>
              </p>
              <div className={styles.error}>
                {acceptError && (
                  <div className={styles.errorText}>יש לאשר את תנאי השימוש</div>
                )}
              </div>
            </div>

            <button
              onClick={onSubmit}
              type="submit"
              className={
                loading ? styles.buttonRegisterLoading : styles.buttonRegister
              }
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>נרשם...</span>
                  <span className={styles.loadingSpinner}></span>
                </>
              ) : (
                "הירשם"
              )}
            </button>

            <p className={styles.loginLink}>
              כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
