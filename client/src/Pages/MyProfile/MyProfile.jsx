import React, { useEffect, useRef, useState } from "react";
import styles from "../MyProfile/MyProfile.module.css";
import { Link } from "react-router-dom";
import Property from "../../components/Property/Property.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { labelStyle } from "../../data/data.js";

import { useAuth } from "../../data/AuthContext.jsx";
import { myUserId, updateMyInformation, verifyPassword } from "../../api/users.js";
import {
  deleteAlert,
  deleteAlerts,
  getAllAlerts,
  readAlert,
} from "../../api/alerts.js";
import { deletePropertyById, myPropeties } from "../../api/property.js";
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

const MyProfile = () => {
  // משתנים של בדיקת חלון בפרופיל
  const [myProfileActive, setMyProfileActive] = useState(true);
  const [myPropertiesActive, setmyPropertiesActive] = useState(false);
  const [myAlertsActive, setMyAlertsActive] = useState(false);
  const [myFavoriteActive, setMyFavoriteActive] = useState(false);

  // משתנים של הנכסים שלי המעודפים והתראות
  const [myProperties, setMyProperties] = useState([]);
  //מקבל state or function from createContext
  const {
    myFavoriteProperties,
    setMyFavoriteProperties,
    setUser,
    isAdmin,
    newAlertArray,
    triggerRefreshAlerts,
  } = useAuth();
  const [alertArray, setAlertArray] = useState([]);
  const [edit, setEdit] = useState(false);

  // סגירה ופתיחת הnav
  const [navCollapsed, setNavCollapsed] = useState(false);
  // משתנים של עדכון פרטים אישיים ושגיאות
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
  const [samePasswordError, setSamePasswordError] = useState(false);
  const [show, setShow] = useState(false);

  // בדיקת הסיסמא
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);

  // משתנים של הודעות, בדיקת חלונות, טעינה ושגיאות וכמות דפים של נכסים
  const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const timeoutRef = useRef(null);
  const [currentPageMyProperties, setCurrentPageMyProperties] = useState(1);
  const [currentPageMyFavoriteProperties, setCurrentPageMyFavoriteProperties] =
    useState(1);

  const propertiesPerPage = 9;
  const indexOfLastProperty = currentPageMyProperties * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const currentProperties = myProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(myProperties.length / propertiesPerPage);

  const indexOfLastFavorite =
    currentPageMyFavoriteProperties * propertiesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - propertiesPerPage;
  const currentFavoriteProperties = myFavoriteProperties.slice(
    indexOfFirstFavorite,
    indexOfLastFavorite
  );
  const totalFavoritePages = Math.ceil(
    myFavoriteProperties.length / propertiesPerPage
  );

  // מתחיל את הדף למעלה אם השתנה החלון
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [currentPageMyProperties, currentPageMyFavoriteProperties]);

  // טעינת פרטי המשתמש
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await myUserId()

        if (res.data) {
          setFullName(res.data.fullName || "");
          setUserName(res.data.userName || "");
          setPhoneNumber(res.data.phoneNumber || "");
          setEmail(res.data.email || "");
        }
      } catch (error) {
        console.error("שגיאה בשליפת נתוני היוזר", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // בדיקת סיסמא נוכחית
  const verifyCurrentPassword = async () => {
    try {
      const res = await verifyPassword(password);
      return res.data.valid;
    } catch (err) {
      console.error("שגיאה באימות סיסמה", err);
      return false;
    }
  };

  //  בדיקת חוזק סיסמא עם התנאים שלה
  useEffect(() => {
    const checks = requirements.map((req) => ({
      ...req,
      passed: req.regex.test(newPassword),
    }));
    setResults(checks);
    setScore(checks.filter((c) => c.passed).length);
  }, [newPassword]);

  //שליפת התראות
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await getAllAlerts();
        setAlertArray(res.data.alerts);
        console.log("alerts:", res.data.alerts);
      } catch (error) {
        console.error("Error getting alerts:", error);
        setAlertArray([]);
      }
    }
    fetchAlerts();
  }, []);

  // הוצאת נכסים שלי ממסד נתונים
  useEffect(() => {
    async function getMyProperties() {
      const res = await myPropeties();
      setMyProperties(res.data);
    }
    getMyProperties();
  }, []);

  // איזה חלון להציג
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

  // עידכון נתוונים אישיים
  async function onSubmit(e) {
    e.preventDefault();
    setSubmited(true);

    //בדיקת ראשונית של שגיאות
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
    if (userName.length <= 7 || userName.includes(" ")) {
      setUserNameError(true);
      hasErrors = true;
    }
    if (phoneNumber.length < 10) {
      setPhoneNumberError(true);
      hasErrors = true;
    }

    if (password !== "" || newPassword !== "") {
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
      if (password === newPassword) {
        setSamePasswordError(true);
        hasErrors = true;
      }
    } else {
      setPasswordError(false);
      setNewPasswordError(false);
      setConfirmNewPasswordError(false);
    }
    // אם יש שגיאה/תקין יוציא הודעה בהתאם
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
    //  עדכון הנתונים ומאםס את הסיסמאות
    try {
      setLoading(true);
      const dataUpdateInfo = { fullName, phoneNumber, newPassword, userName };
      const res = await updateMyInformation(dataUpdateInfo);
      console.log(res.data);
      setShowMessageVisibilty(true);
      setShowMessage(res.data);
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
      // אם יש שגיאה/תקין יוציא הודעה בהתאם
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
  // בדיקה בזמן אמת שהכל תקין
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
      if (userName.trim().length > 7 && !userName.includes(" ")) {
        setUserNameError(false);
      } else {
        setUserNameError(true);
      }
      if (phoneNumber.length >= 10) {
        setPhoneNumberError(false);
      } else {
        setPhoneNumberError(true);
      }
      if (password !== "" || newPassword !== "") {
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
        if (password !== newPassword) {
          setSamePasswordError(false);
        } else {
          setSamePasswordError(true);
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
    password,
    newPassword,
    confirmNewPassword,
  ]);
  // הגדרות של נראות חוזק הסיסמא
  const strengthLabel = ["", "חלש", "בינונית", "חזקה"];
  const strengthColor = ["gray", "red", "orange", "green"];
  const strengthIndex = score === 0 ? 0 : score <= 2 ? 1 : score <= 4 ? 2 : 3;
  // אם המשתמש מהטלפון אז התפריט יוצג אחרת
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 500) {
        setNavCollapsed(true);
      } else {
        setNavCollapsed(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // מחיקת נכס לפי מזהה
  const deleteProperty = async (id) => {
    try {
      await deletePropertyById(id);
      setMyProperties((prev) => prev.filter((p) => p._id !== id));
      setUser((prevUser) => ({
        ...prevUser,
        favoriteProperties: prevUser.favoriteProperties.filter(
          (favId) => favId !== id
        ),
      }));

      setMyFavoriteProperties((prevFavs) =>
        prevFavs.filter((p) => p._id !== id)
      );
      setShowMessage("נכס נמחק בהצלחה");
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
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
  // מחיקת התראות

  const removeAllAlerts = async () => {
    try {
      await deleteAlerts();
      setAlertArray([]);
      triggerRefreshAlerts();
      setShowMessage("ההתראות נמחקו בהצלחה");
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
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
  // מחיקת התראה לפי מזהה
  const removeAlert = async (id) => {
    try {
      const res = await deleteAlert(id);
      console.log(res.data.message);
      triggerRefreshAlerts();
      setAlertArray((prev) => prev.filter((alert) => alert._id !== id));
      setShowMessage("ההתראה נמחקה בהצלחה");
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
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
  // קריאת התראה לפי מזהה

  const unNewAlert = async (id) => {
    try {
      await readAlert(id);

      setAlertArray((prev) =>
        prev.map((al) => (al._id === id ? { ...al, isNewAlert: false } : al))
      );
      triggerRefreshAlerts();
      setShowMessage("ההתראה נקראה בהצלחה");
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
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
          {navCollapsed ? (
            ""
          ) : (
            <h2> {isAdmin ? "ניהול מערכת" : "איזור אישי"}</h2>
          )}
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
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={
                    navCollapsed ? styles.smallListItem : styles.listItem
                  }
                >
                  <span>📊</span>
                  {navCollapsed ? "" : <span>לוח בקרה</span>}
                </Link>
                <Link
                  to="/admin/users"
                  className={
                    navCollapsed ? styles.smallListItem : styles.listItem
                  }
                >
                  <span>👩‍👦</span>
                  {navCollapsed ? "" : <span>ניהול משתמשים</span>}
                </Link>
              </>
            )}

            <Link
              to="/properties"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>🏠︎</span>
              {navCollapsed ? "" : <span>נכסים</span>}
            </Link>
            <Link
              className={navCollapsed ? styles.smallListItem : styles.listItem}
              style={{ backgroundColor: "hsl(30, 100%, 60%)" }}
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
                    <label style={labelStyle(userNameError)}>שם משתמש</label>
                    <CustomInput
                      value={userName}
                      type="text"
                      className={styles.input}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <div className={styles.error}>
                      {userNameError && (
                        <div className={styles.errorText}>
                          שם משתמש חייב להכיל לפחות 8 תווים ובלי רווחים
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
                  שינוי סיסמא
                </h2>
                <div className={styles.containerInputs}>
                  <div className={styles.field}>
                    <label style={labelStyle(passwordError)}>
                      סיסמה נוכחית
                    </label>
                    <CustomInput
                      value={password}
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
                      <label
                        style={labelStyle(
                          newPasswordError || samePasswordError
                        )}
                      >
                        סיסמה חדשה
                      </label>
                      <CustomInput
                        value={newPassword}
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
                      <div className={styles.error}>
                        {samePasswordError && (
                          <div className={styles.errorText}>
                            הסיסמא החדשה זהה לסיסמא הנוכחית
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label style={labelStyle(confirmNewPasswordError)}>
                        אימות סיסמה חדשה
                      </label>
                      <CustomInput
                        value={confirmNewPassword}
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
                    disabled={loading}
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
              <div className={styles.headerBtn}>
                <Link to="/add-property">
                  <button className={styles.addNewPropertie}>
                    הוסף נכנס חדש +
                  </button>
                </Link>
                <button
                  className={styles.editMyProperties}
                  onClick={() => setEdit(!edit)}
                >
                  מצב עריכה
                </button>
              </div>
            </div>
            {myProperties?.length > 0 ? (
              <div>
                <div className={styles.containerProperties}>
                  <Property
                    properties={currentProperties}
                    onDelete={deleteProperty}
                    edit={edit}
                  />
                </div>
                <div className={styles.pagination}>
                  <button
                    onClick={() => {
                      if (currentPageMyProperties > 1)
                        setCurrentPageMyProperties(currentPageMyProperties - 1);
                    }}
                    disabled={currentPageMyProperties === 1}
                  >
                    הקודם
                  </button>
                  {(() => {
                    const buttons = [];
                    for (let i = 1; i <= totalPages; i++) {
                      buttons.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPageMyProperties(i)}
                          className={
                            currentPageMyProperties === i
                              ? styles.activePage
                              : ""
                          }
                        >
                          {i}
                        </button>
                      );
                    }
                    return buttons;
                  })()}
                  <button
                    onClick={() => {
                      if (currentPageMyProperties < totalPages)
                        setCurrentPageMyProperties(currentPageMyProperties + 1);
                    }}
                    disabled={currentPageMyProperties >= totalPages}
                  >
                    הבא
                  </button>
                </div>
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
            <div className={styles.headerDiv}>
              <h2 className={styles.headerContainerSelected}>ההתראות שלי</h2>
              <span>{newAlertArray.length} התראות חדשות</span>
            </div>

            {alertArray.length > 0 ? (
              <div className={styles.alertsList}>
                {alertArray.map((alert) => (
                  <div key={alert._id} className={styles.alertItem}>
                    {alert.text}
                    <div className={styles.buttonsAlert}>
                      {alert?.isNewAlert && (
                        <button
                          title="קראתי את ההתראה"
                          onClick={() => unNewAlert(alert._id)}
                          className={styles.seenBtn}
                        >
                          <i className="fa-solid fa-ban" />
                        </button>
                      )}

                      <button
                        title="מחק התראה"
                        onClick={() => removeAlert(alert._id)}
                        className={styles.deleteBtn}
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={removeAllAlerts}
                  className={styles.removeAllAlerts}
                >
                  נקה הכל
                </button>
              </div>
            ) : (
              <div className={styles.noAlerts}>אין התראות חדשות</div>
            )}
          </div>
        )}

        {myFavoriteActive && (
          <div className={styles.containerSelected}>
            <h2 className={styles.headerContainerSelected}>נכסים מעודפים</h2>
            {myFavoriteProperties?.length > 0 ? (
              <>
                <div className={styles.containerProperties}>
                  <Property properties={currentFavoriteProperties} />
                </div>
                <div className={styles.pagination}>
                  <button
                    onClick={() => {
                      if (currentPageMyFavoriteProperties > 1)
                        setCurrentPageMyFavoriteProperties(
                          currentPageMyFavoriteProperties - 1
                        );
                    }}
                    disabled={currentPageMyFavoriteProperties === 1}
                  >
                    הקודם
                  </button>
                  {Array.from(
                    { length: totalFavoritePages },
                    (_, i) => i + 1
                  ).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPageMyFavoriteProperties(num)}
                      className={
                        currentPageMyFavoriteProperties === num
                          ? styles.activePage
                          : ""
                      }
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (currentPageMyFavoriteProperties < totalFavoritePages)
                        setCurrentPageMyFavoriteProperties(
                          currentPageMyFavoriteProperties + 1
                        );
                    }}
                    disabled={
                      currentPageMyFavoriteProperties >= totalFavoritePages
                    }
                  >
                    הבא
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.Properties}>
                <p>אין נכסים מעודפים</p>
                <Link to="/properties">
                  <button className={styles.addNewPropertie}>
                    חיפוש נכסים
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
