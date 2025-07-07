import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomSelect from "../CustomSelect/CustomSelect";
import { useAuth } from "../../data/AuthContext.jsx";

const Header = () => {
  //משתנים
  const [alertActive, setAlertActive] = useState(false);
  const { user, setUser } = useAuth();
  const ref = useRef();
  const navigate = useNavigate();
  // ערכים לרשימה של הפרופיל
  const options = [
    { label: "פרופיל שלי", to: "/my-profile" },
    { label: "הנכסים שלי", to: "/my-profile?section=properties" },
    { label: "נכסים מעודפים", to: "/my-profile?section=favorites" },
    { label: "התנתק" },
  ];
  // התנתקות
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // בודר האם הערך שנלחץ הוא התנתקות אם לא אז הוא ישלח אותי לכתובת שנלחצה
  const handleSelectChange = (label) => {
    if (label === "התנתק") {
      logout();
    } else {
      const option = options.find((opt) => opt.label === label);
      if (option && option.to) {
        navigate(option.to);
      }
    }
  };

  //בדיקה האם היוזר לחץ מחוץ להתראות אם כן סוגר
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setAlertActive(false);
    }
  };

  // מוסיף אירוע לחיצה על הרשימה בשביל הבדיקה
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
                  <p>אין התראות חדשות</p>
                </div>
              )}
            </>
            <div className={styles.userProfile}>
              <div className={styles.firstLetter}>
                {user.fullName?.charAt(0) || ""}
              </div>
              <CustomSelect
                options={options}
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
