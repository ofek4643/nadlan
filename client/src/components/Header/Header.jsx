import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import CustomSelect from "../CustomSelect/CustomSelect";
import { useAuth } from "../../data/AuthContext.jsx";
import { logoutUser } from "../../api/users.js";
import { newAlerts } from "../../api/alerts.js";

const Header = () => {
  //משתנים

  const [alertActive, setAlertActive] = useState(false);
  const {
    user,
    setUser,
    isAdmin,
    newAlertArray,
    refreshAlerts,
    setNewAlertArray,
  } = useAuth();
  const ref = useRef();
  const navigate = useNavigate();

  // רשימות אפשרויות בתפריט הפרופיל
  const options = [
    { label: "הפרופיל שלי", to: "/my-profile" },
    { label: "התנתק" },
  ];
  const optionsAdmin = [
    { label: "הפרופיל שלי", to: "/my-profile" },
    { label: "ניהול משתמשים", to: "/admin/users" },
    { label: "לוח בקרה", to: "/admin/dashboard" },
    { label: "התנתק" },
  ];

  // התנתקות
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/", { state: { showMessage: "התנתקת בהצלחה" } });
    } catch (error) {
      console.error("שגיאה בהתנתקות:", error);
    }
  };

  // טיפול בבחירת אפשרות בתפריט הפרופיל
  const handleSelectChange = (label) => {
    if (label === "התנתק") {
      logout();
    } else {
      const list = isAdmin ? optionsAdmin : options;
      const option = list.find((opt) => opt.label === label);
      if (option?.to) navigate(option.to);
    }
  };

  // סגירת חלון התראות בלחיצה מחוץ לו
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setAlertActive(false);
    }
  };

  // הוספת מאזין לחיצות מחוץ להתראות
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // עדכון התראות כשמתבצע טריגר רענון
  useEffect(() => {
    if (!user) {
      setNewAlertArray([]);
      return;
    }
    // שליפת התראות חדשות
    const fetchNewAlerts = async () => {
      try {
        const res = await newAlerts();
        setNewAlertArray(res.data.newAlerts);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          setNewAlertArray([]);
        } else {
          console.error("שגיאה במשיכת התראות חדשות", error);
        }
      }
    };

    fetchNewAlerts();
  }, [refreshAlerts, setNewAlertArray, user, setUser]);
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/">
          <h2 className={styles.logo}>נדל"ן ישראלי</h2>
        </Link>
        <ul className={styles.navList}>
          <Link to="/">דף הבית</Link>
          <Link to="properties">חיפוש נכסים</Link>
          {user && <Link to="add-property">פרסם נכס</Link>}
          <Link to="mortgage-calculator">מחשבון משכנתא</Link>
        </ul>
        {!user && (
          <div className={styles.authButtons}>
            <Link to="login">
              <button className={styles.LoginBtn}>התחברות</button>
            </Link>
            <Link to="register">
              <button className={styles.RegisterBtn}>הרשמה</button>
            </Link>
          </div>
        )}
        {user && (
          <div className={styles.authButtonsLogin}>
            <>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setAlertActive((prev) => !prev)}
                className={styles.alertButton}
              >
                <i className="fa-solid fa-bell"></i>
              </button>
              {alertActive && (
                <div ref={ref} className={styles.alertDiv}>
                  <h2>התראות</h2>
                  <p>
                    {newAlertArray.length > 0
                      ? `יש ${newAlertArray.length} התראות חדשות`
                      : "אין התראות חדשות"}
                  </p>
                </div>
              )}
            </>
            <div className={styles.userProfile}>
              <div className={styles.firstLetter}>
                {user.fullName?.charAt(0) || ""}
              </div>
              <CustomSelect
                options={isAdmin ? optionsAdmin : options}
                placeholder={user.fullName}
                className="custom-selectHeader"
                className2="select-btnHeader"
                forcePlaceholder={true}
                onChange={handleSelectChange}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
