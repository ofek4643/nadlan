import { Link } from "react-router-dom";
import styles from "../Home/Home.module.css";
import Property from "../../components/Property/Property";
import allProperties from "../../data/properties.js"
const Home = () => {

  return (
    <div>
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
            {/* login ? "properties" : "login" */}
          <Link to={""}>
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
          <Property properties={allProperties.slice(0, 3)} />
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
        <div className={styles.ad}>
          <h2 className={styles.adHeader}>מחפש לקנות או למכור נכס?</h2>
          <p className={styles.adSubTitle}>
            הצטרף למאות המשתמשים שמצאו את הנכס המושלם או את הקונה האידיאלי
            באמצעות הפלטפורמה שלנו
          </p>
          <div className={styles.btnContainer}>
            <Link to="/login">
              <button className={styles.adLoginBtn}>הרשם עכשיו</button>
            </Link>
            <Link to="/properties">
              <button className={styles.adSearchProperty}>חפש נכסים</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
