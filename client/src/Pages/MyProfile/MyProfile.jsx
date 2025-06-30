import React, { useEffect, useState } from "react";
import styles from "../MyProfile/MyProfile.module.css";
import { Link } from "react-router-dom";
import Property from "../../components/Property/Property.jsx";
// import allProperties from "../../data/properties.js";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { labelStyle } from "../../data/properties.js";

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

const MyProfile = () => {
  const [myProfileActive, setMyProfileActive] = useState(true);
  const [myPropertiesActive, setmyPropertiesActive] = useState(false);
  const [myAlertsActive, setMyAlertsActive] = useState(false);
  const [myFavoriteActive, setMyFavoriteActive] = useState(false);

  const [myProperties, setMyProperties] = useState(null);
  const [alertArray, setAlertArray] = useState(null);

  const [navCollapsed, setNavCollapsed] = useState(false);

  const [submited, setSubmited] = useState(false);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmPasswordError, setConfirmNewPasswordError] = useState(false);

  useEffect(() => {
    const checks = requirements.map((req) => ({
      ...req,
      passed: req.regex.test(newPassword),
    }));
    setResults(checks);
    setScore(checks.filter((c) => c.passed).length);
  }, [newPassword]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch();
        const data = await res.json();
        setAlertArray(data.alerts);
        setMyProperties(data.Properties);
      } catch (error) {
        console.error("Error in get alerts", error);
        setAlertArray([]);
      }
    }
    fetchAlerts();
  }, []);

  function changeMyProfileActive() {
    setMyProfileActive(true);
    setmyPropertiesActive(false);
    setMyAlertsActive(false);
    setMyFavoriteActive(false);
  }
  function changeMyPropertiesActive() {
    setMyProfileActive(false);
    setmyPropertiesActive(true);
    setMyAlertsActive(false);
    setMyFavoriteActive(false);
  }
  function changeMyAlertsActive() {
    setMyProfileActive(false);
    setmyPropertiesActive(false);
    setMyAlertsActive(true);
    setMyFavoriteActive(false);
  }
  function changeMyFavoriteActive() {
    setMyProfileActive(false);
    setmyPropertiesActive(false);
    setMyAlertsActive(false);
    setMyFavoriteActive(true);
  }

  function onSubmit() {
    setSubmited(true);
    if (fullName.length <= 3) {
      setFullNameError(true);
    }
    if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
      setEmailError(true);
    }
    if (phoneNumber.length < 9) {
      setPhoneNumberError(true);
    }

    if (newPassword !== confirmNewPassword || newPassword === "") {
      setConfirmNewPasswordError(true);
    }
    if (score !== 5) {
      setNewPasswordError(true);
    }
  }

  useEffect(() => {
    if (submited) {
      if (fullName.trim().length > 3 && fullName.includes(" ")) {
        setFullNameError(false);
      } else {
        setFullNameError(true);
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
        setNewPasswordError(false);
      } else {
        setNewPasswordError(true);
      }
      if (newPassword === confirmNewPassword && newPassword !== "") {
        setConfirmNewPasswordError(false);
      } else {
        setConfirmNewPasswordError(true);
      }
    }
  }, [
    submited,
    fullName,
    email,
    phoneNumber,
    score,
    newPassword,
    confirmNewPassword,
  ]);

  const strengthLabel = ["", "חלש", "בינונית", "חזקה"];
  const strengthColor = ["gray", "red", "orange", "green"];
  const strengthIndex = score === 0 ? 0 : score <= 2 ? 1 : score <= 4 ? 2 : 3;

  return (
    <div className={styles.warrper}>
      <div
        className={navCollapsed ? styles.smallNavProfile : styles.navProfile}
      >
        <div className={styles.headerNav}>
          {navCollapsed ? "" : <h2>איזור אישי</h2>}
          <label className={styles.label}>
            <input
              onClick={() => setNavCollapsed((prev) => !prev)}
              className={styles.menu}
              type="checkbox"
            />
            ☰
          </label>
        </div>
        <hr />
        <nav>
          <ul className={styles.List}>
            <Link
              to="/properties"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>🏠︎</span>
              {navCollapsed ? "" : <span>נכסים</span>}
            </Link>
            <Link
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>⚙</span>
              {navCollapsed ? "" : <span>הגדרות פרופיל</span>}
            </Link>
            <Link
              to="/mortgage-calculator"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>🗎</span>
              {navCollapsed ? "" : <span>מחשבון משכנתא</span>}
            </Link>
            <Link
              to="/"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i>
              {navCollapsed ? "" : <span>חזרה לאתר</span>}
            </Link>
          </ul>
        </nav>
      </div>
      <div className={styles.containerMyProfile}>
        <h2 className={styles.headerMyProfile}>הפרופיל שלי</h2>
        <div className={styles.containerButton}>
          <button
            className={styles.headerButtonsMyProfile}
            onClick={() => changeMyProfileActive()}
            style={{
              backgroundColor: myProfileActive ? "#e0f2ff" : "#f1f1f1",
              color: myProfileActive ? "#003b5c" : "#666",
            }}
          >
            פרופיל
            <i className={`fa-regular fa-user ${styles.icon}`}></i>
          </button>
          <button
            className={styles.headerButtonsMyProfile}
            onClick={() => changeMyPropertiesActive()}
            style={{
              backgroundColor: myPropertiesActive ? "#e0f2ff" : "#f1f1f1",
              color: myPropertiesActive ? "#003b5c" : "#666",
            }}
          >
            הנכסים שלי
            <i className={`fa-solid fa-house ${styles.icon}`}></i>
          </button>
          <button
            className={styles.headerButtonsMyProfile}
            onClick={() => changeMyAlertsActive()}
            style={{
              backgroundColor: myAlertsActive ? "#e0f2ff" : "#f1f1f1",
              color: myAlertsActive ? "#003b5c" : "#666",
            }}
          >
            התראות
            <i className={`fa-solid fa-bell ${styles.icon}`}></i>
          </button>
          <button
            className={styles.headerButtonsMyProfile}
            onClick={() => changeMyFavoriteActive()}
            style={{
              backgroundColor: myFavoriteActive ? "#e0f2ff" : "#f1f1f1",
              color: myFavoriteActive ? "#003b5c" : "#666",
            }}
          >
            נכסים מעודפים
            <i className={`fa-solid fa-heart ${styles.icon}`}></i>
          </button>
        </div>
        {myProfileActive && (
          <div className={styles.containerSelected}>
            <h2 className={styles.headerContainerSelected}>פרטים אישיים</h2>
            <div className={styles.containerInputs}>
              <form>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>שם משתמש</label>
                    <CustomInput
                      placeholder="dw"
                      type="text"
                      className={styles.input}
                      readOnly
                    />
                  </div>
                  <div className={styles.field}>
                    <label style={labelStyle(emailError)}>אימייל</label>
                    <CustomInput
                      placeholder="your@email.com"
                      type="text"
                      className={styles.input}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className={styles.error}>
                      {emailError && (
                        <div className={styles.errorText}>אימייל לא תקין </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label style={labelStyle(fullNameError)}>שם מלא</label>
                    <CustomInput
                      type="text"
                      className={`${styles.input} ${styles.marginBottom}`}
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
                  <div className={styles.field}>
                    <label style={labelStyle(phoneNumberError)}>טלפון</label>
                    <CustomInput
                      type="text"
                      className={`${styles.input} ${styles.marginBottom}`}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div className={styles.error}>
                      {phoneNumberError && (
                        <div className={styles.errorText}>
                          מספר טלפון לא תקין
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <hr />
                <h2 className={styles.secendHeaderContainerSelected}>
                  פרטים אישיים
                </h2>
                <div className={styles.containerInputs}>
                  <div className={styles.field}>
                    <label>סיסמה נוכחית</label>
                    <CustomInput
                      placeholder="הזן את הסיסמה הנוכחית"
                      autoComplete="current-password"
                      type="password"
                      className={styles.input}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label style={labelStyle(newPasswordError)}>
                        סיסמה חדשה
                      </label>
                      <CustomInput
                        placeholder="הזן את הסיסמה החדשה"
                        autoComplete="new-password"
                        type="password"
                        className={styles.input}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <div className={styles.error}>
                        {newPasswordError && (
                          <div className={styles.errorText}>
                            סיסמה חייבת להיות ברמה חזקה
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label style={labelStyle(confirmPasswordError)}>
                        אימות סיסמה חדשה
                      </label>
                      <CustomInput
                        placeholder="הזן שוב את הסיסמה החדשה"
                        autoComplete="new-password"
                        type="password"
                        className={styles.input}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                      <div className={styles.error}>
                        {confirmPasswordError && (
                          <div className={styles.errorText}>
                            הסיסמאות לא תואמות
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.containerReq}>
                    <ul>
                      {results.map((req) => (
                        <li
                          key={req.id}
                          className={styles.listResult}
                          style={{ color: req.passed ? "green" : "red" }}
                        >
                          {req.passed ? "✔️" : "❌"} {req.message}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 20 }}>
                      חוזק הסיסמא:{" "}
                      <strong>{strengthLabel[strengthIndex]}</strong>
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
                  <button
                    onClick={onSubmit}
                    type="submit"
                    className={styles.saveBtn}
                  >
                    שמור שינויים
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {myPropertiesActive && (
          <div className={styles.containerSelected}>
            <div className={styles.headerDiv}>
              <h2 className={styles.headerContainerSelected}>הנכסים שלי</h2>
              <Link to="/add-property">
                <button className={styles.addNewPropertie}>
                  הוסף נכנס חדש +
                </button>
              </Link>
            </div>
            {myProperties?.length > 0 ? (
              <div className={styles.containerProperties}>
                <Property
                  properties={allProperties.slice(0, myProperties.length)}
                />
              </div>
            ) : (
              <div className={styles.Properties}>
                <p>טרם פרסמת נכסים במערכת</p>
                <Link to="/add-property">
                  <button className={styles.addNewPropertie}>
                    פרסם נכס ראשון +
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
        {myAlertsActive && (
          <div className={styles.containerSelected}>
            <h2 className={styles.headerContainerSelected}>התראות</h2>
            <div className={styles.alerts}>
              {alertArray?.length > 0
                ? alertArray.map((alert, index) => (
                    <div className={styles.alert} key={index}>
                      {alert}
                    </div>
                  ))
                : "אין התראות חדשות"}
            </div>
          </div>
        )}
        {myFavoriteActive && <div>נכסים מעודפים</div>}
      </div>
    </div>
  );
};

export default MyProfile;
