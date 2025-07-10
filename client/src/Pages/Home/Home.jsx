import { Link } from "react-router-dom";
import styles from "../Home/Home.module.css";
import Property from "../../components/Property/Property";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../data/AuthContext";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // משתנים של הודעה
  const [message, setMessage] = useState(""); // הודעת הצלחה
  const [messageErrorFetchVisibility, setMessageErrorFetchVisibility] =
    useState(false);
  const messageErrorFetch = "אירעה שגיאה בטעינת הנתונים";

  // מושך את הנכסים בדף הבית
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await axios.get("http://localhost:5000/properties");
        setProperties(res.data.properties);
      } catch (err) {
        console.error("שגיאה:", err);
        setMessageErrorFetchVisibility(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // מראה את ההודעת הצלחה מהתחברות
  useEffect(() => {
    if (location.state?.showMessage) {
      setMessage(location.state.showMessage);

      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  return (
    <div>
      {message && <div className={styles.successMessage}>{message}</div>}

      <div className={styles.container}>
        <h2 className={styles.header}>
          מצא את הנכס <span className={styles.headerSpan}>המושלם </span>עבורך
        </h2>
        <p className={styles.subtitles}>
          הפלטפורמה המובילה בישראל למציאת, קנייה ומכירה של נדל"ן עם אלפי נכסים
          למכירה ולהשכרה ברחבי הארץ
        </p>
        <div className={styles.btnContainer}>
          <Link to="properties">
            <button className={styles.searchProp}>🔍 חיפוש נכסים </button>
          </Link>

          <Link to={user ? "add-property" : "login"}>
            <button className={styles.postProp}>🏠 פרסם נכס</button>
          </Link>
        </div>
      </div>

      <div className={styles.containerProperty}>
        <div className={styles.containerPropertyHeader}>
          <h2 className={styles.PropertyHeader}>נכסים מומלצים</h2>
          <Link className={styles.link} to="properties">
            <button className={styles.linkProperty}>צפה בכל הנכסים</button>
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
        </div>
        <div className={styles.Properties}>
          {loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
            <Property properties={properties.slice(0, 3)} />
          )}
          {messageErrorFetchVisibility && (
            <div className={styles.errorMessage}>{messageErrorFetch}</div>
          )}
        </div>
      </div>

      <div className={styles.servicesContainer}>
        <div className={styles.servicesHeaderDiv}>
          <h2 className={styles.servicesHeader}>השירותים שלנו</h2>
        </div>
        <div className={styles.services}>
          <div className={styles.cardService}>
            <i className={`fa-solid fa-magnifying-glass ${styles.iconImg}`}></i>
            <h3 className={styles.cardServiceHeader}>חיפוש נכסים</h3>
            <p className={styles.cardServiceSubTitles}>
              חפש בין אלפי נכסים למכירה ולהשכרה ברחבי ישראל באמצעות מערכת החיפוש
              המתקדמת שלנו.
            </p>
          </div>
          <div className={styles.cardService}>
            <i className={`fa-solid fa-house ${styles.iconImg}`}></i>
            <h3 className={styles.cardServiceHeader}>פרסום נכסים</h3>
            <p className={styles.cardServiceSubTitles}>
              פרסם את הנכס שלך בקלות ומהירות וקבל חשיפה מקסימלית לקהל רחב של
              רוכשים ושוכרים פוטנציאליים.
            </p>
          </div>
          <div className={styles.cardService}>
            <i className={`fa-solid fa-calculator ${styles.iconImg}`}></i>
            <h3 className={styles.cardServiceHeader}>מחשבון משכנתא</h3>
            <p className={styles.cardServiceSubTitles}>
              חשב את תשלומי המשכנתא החודשיים שלך וקבל מידע על מסלולי משכנתא
              שונים באמצעות המחשבון המתקדם שלנו.
            </p>
          </div>
        </div>
        {!user && (
          <div className={styles.ad}>
            <h2 className={styles.adHeader}>מחפש לקנות או למכור נכס?</h2>
            <p className={styles.adSubTitle}>
              הצטרף למאות המשתמשים שמצאו את הנכס המושלם או את הקונה האידיאלי
              באמצעות הפלטפורמה שלנו
            </p>
            <div className={styles.btnContainer}>
              <Link to="/register">
                <button className={styles.adLoginBtn}>הרשם עכשיו</button>
              </Link>
              <Link to="/properties">
                <button className={styles.adSearchProperty}>חפש נכסים</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
