import React, { useEffect, useRef, useState } from "react";
import styles from "../MyProfile/MyProfile.module.css";
import { Link, useSearchParams } from "react-router-dom";
import Property from "../../components/Property/Property.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { labelStyle } from "../../data/properties.js";
import axios from "axios";

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
  const [show, setShow] = useState(false);

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

  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  const [loading, setLoading] = useState(false);
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        });

        if (res.data) {
          setFullName(res.data.fullName || "");
          setUserName(res.data.userName || "");
          setPhoneNumber(res.data.phoneNumber || "");
          setEmail(res.data.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const verifyCurrentPassword = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/users/verify-password",
        { password }, // הסיסמה הנוכחית שהמשתמש הזין
        { withCredentials: true }
      );
      return res.data.valid; // תחזיר true אם תקין
    } catch (err) {
      console.error("שגיאה באימות סיסמה", err);
      return false;
    }
  };

  useEffect(() => {
    switch (section) {
      case "properties":
        changeMyPropertiesActive();
        break;
      case "alerts":
        changeMyAlertsActive();
        break;
      case "favorites":
        changeMyFavoriteActive();
        break;
      default:
        changeMyProfileActive();
    }
  }, [section]);
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

  async function onSubmit(e) {
    e.preventDefault();
    setSubmited(true);
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
    if (phoneNumber.length < 9) {
      setPhoneNumberError(true);
      hasErrors = true;
    }

    if (newPassword !== "") {
      const isPasswordValid = await verifyCurrentPassword();
      if (!isPasswordValid) {
        setPasswordError(true);
        hasErrors = true;
      } else {
        setPasswordError(false);
      }
      if (score !== 5) {
        setNewPasswordError(true);
        hasErrors = true;
      }

      if (newPassword !== confirmNewPassword || confirmNewPassword === "") {
        setConfirmNewPasswordError(true);
        hasErrors = true;
      }
    } else {
      setPasswordError(false);
    }

    if (hasErrors) {
      setShowMessage(""); // אפס קודם
      setShowMessageVisibilty(false); // סגור קודם
      setTimeout(() => {
        setShowMessage("יש למלא את כל השדות בצורה תקינה");
        setShowMessageVisibilty(true);
      }, 10); // המתנה קטנה כדי לאלץ React לרנדר מחדש

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);

      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/users/update-information",
        { fullName, phoneNumber, newPassword },
        { withCredentials: true }
      );
      console.log(res.data);
      setShowMessageVisibilty(true);
      setShowMessage(res.data);
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
  }

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
      if (phoneNumber.length >= 10) {
        setPhoneNumberError(false);
      } else {
        setPhoneNumberError(true);
      }
      if (newPassword !== "") {
        if (score >= 5) {
          setNewPasswordError(false);
        } else {
          setNewPasswordError(true);
        }
        if (newPassword === confirmNewPassword && confirmNewPassword !== "") {
          setConfirmNewPasswordError(false);
        } else {
          setConfirmNewPasswordError(true);
        }
      } else {
        setNewPasswordError(false);
        setConfirmNewPasswordError(false);
      }
    }
  }, [
    submited,
    fullName,
    userName,
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
                    <label style={labelStyle()}>שם משתמש</label>
                    <CustomInput
                      value={userName}
                      type="text"
                      className={styles.input}
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
                  <div className={styles.field}>
                    <label>אימייל</label>
                    <CustomInput
                      placeholder={email}
                      type="text"
                      className={styles.input}
                      readOnly
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label style={labelStyle(fullNameError)}>שם מלא</label>
                    <CustomInput
                      value={fullName}
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
                      type="tel"
                      className={`${styles.input} ${styles.marginBottom}`}
                      placeholder="0501234567"
                      value={phoneNumber}
                      autoComplete="phoneNumber"
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
                    <label style={labelStyle(passwordError)}>
                      סיסמה נוכחית
                    </label>
                    <CustomInput
                      placeholder="הזן את הסיסמה הנוכחית"
                      autoComplete="current-password"
                      type={show ? "text" : "password"}
                      className={styles.input}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className={styles.error}>
                      {passwordError && (
                        <div className={styles.errorText}>
                          סיסמה נוכחית לא נכונה
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label style={labelStyle(newPasswordError)}>
                        סיסמה חדשה
                      </label>
                      <CustomInput
                        placeholder="הזן את הסיסמה החדשה"
                        autoComplete="new-password"
                        type={show ? "text" : "password"}
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
                      <label style={labelStyle(confirmNewPasswordError)}>
                        אימות סיסמה חדשה
                      </label>
                      <CustomInput
                        placeholder="הזן שוב את הסיסמה החדשה"
                        autoComplete="new-password"
                        type={show ? "text" : "password"}
                        className={styles.input}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                      <div className={styles.error}>
                        {confirmNewPasswordError && (
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
                      חוזק הסיסמא:
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
                  <div className={styles.showPass}>
                    <button
                      onClick={() => setShow(show ? false : true)}
                      className={styles.buttonShowPassword}
                      type="button"
                    >
                      {show ? "הסתר" : "הצג"} סיסמאות
                    </button>
                  </div>
                  <button
                    onClick={onSubmit}
                    type="submit"
                    className={loading ? styles.saveBtnLoading : styles.saveBtn}
                    // disabled={showMessageVisibilty}
                  >
                    {loading ? (
                      <>
                        <span>שומר...</span>
                        <span className={styles.loadingSpinner}></span>
                      </>
                    ) : (
                      "שמור שינויים"
                    )}
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
