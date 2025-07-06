import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomSelect from "../CustomSelect/CustomSelect";

const Header = () => {
  const [alertActive, setAlertActive] = useState(false);
  const [user, setUser] = useState(null);
  const ref = useRef();
  const navigate = useNavigate();

  const options = [
    { label: "פרופיל שלי", to: "/my-profile" },
    { label: "הנכסים שלי", to: "/my-profile?section=properties" },
    { label: "נכסים מעודפים", to: "/my-profile?section=favorites" },
    { label: "התנתק" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        if (!error.response) {
          console.error("שגיאת רשת:", error);
        }
        setUser(null);
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
                {user.fullName.charAt(0)}
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
