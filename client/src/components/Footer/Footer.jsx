import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
      <footer>
        <div className={styles.containerAll}>
          <div className={styles.containerInfo}>
            <div className={styles.twoGap}>
              <h3 className={styles.headers}>נדל"ן ישראלי</h3>
              <p>הפלטפורמה המובילה בישראל למציאת נכסי נדל"ן לרכישה והשכרה.</p>
              <div className={styles.iconDiv}>
                <a href="">
                  <i className={`fa-brands fa-facebook-f ${styles.white}`}></i>
                </a>
                <a href="">
                  <i className={`fa-brands fa-twitter ${styles.white}`}></i>
                </a>
                <a href="">
                  <i className={`fa-brands fa-instagram ${styles.white}`}></i>
                </a>
                <a href="">
                  <i className={`fa-brands fa-linkedin-in ${styles.white}`}></i>
                </a>
              </div>
            </div>
            <div className={styles.oneGap}>
              <h3 className={styles.headers}>קישורים מהירים</h3>
              <ul>
                <li className={styles.listItem}>
                  <a className={styles.white} href="">
                    דף הבית
                  </a>
                </li>
                <li className={styles.listItem}>
                  <a className={styles.white} href="">
                    חיפוש נכסים
                  </a>
                </li>
                <li className={styles.listItem}>
                  <a className={styles.white} href="">
                    מחשבון משכנתא
                  </a>
                </li>
                <li className={styles.listItem}>
                  <a className={styles.white} href="">
                    סוכני נדל"ן
                  </a>
                </li>
                <li className={styles.listItem}>
                  <a className={styles.white} href="">
                    מדריך למוכרים
                  </a>
                </li>
                <li className={styles.listItem}>
                  <a className={styles.white} href="">
                    מדריך לקונים
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.oneGap}>
              <h3 className={styles.headers}>צור קשר</h3>
              <ul>
                <li className={styles.listInformation}>
                  <i className="fa-solid fa-location-dot"></i>
                  <span className={styles.info}>רחוב אלנבי 58, תל אביב</span>
                </li>
                <li className={styles.listInformation}>
                  <i className="fa-solid fa-phone"></i>
                  <span className={styles.info}>03-1234567</span>
                </li>
                <li className={styles.listInformation}>
                  <i className="fa-solid fa-envelope"></i>
                  <span className={styles.info}>info@realestate-il.com</span>
                </li>
                <li className={styles.listInformation}>
                  <i className="fa-solid fa-clock"></i>
                  <span className={styles.info}>ימים א'-ה': 09:00-18:00</span>
                </li>
              </ul>
            </div>
            <div className={styles.twoGap}>
              <h3 className={styles.headers}>הרשמה לעדכונים</h3>
              <p>הישארו מעודכנים בנכסים חדשים ומבצעים מיוחדים</p>
              <form className={styles.form}>
                <input
                  className={styles.inputField}
                  type="email"
                  placeholder="כתובת איימל"
                />
                <button className={styles.sendBtn}>📩</button>
              </form>
            </div>
          </div>
          <div className={styles.copyRight}>
            <span> © 2023 נדל"ן ישראלי. כל הזכויות שמורות.</span>
            <div className={styles.btnContainer}>
              <Link to="/terms of use">
                <button className={styles.btnFooter}>תנאי שימוש</button>
              </Link>
              <Link to="/Privacy Policy">
                  <button className={styles.btnFooter}>מדיניות פרטיות</button>
              </Link>
              <Link to="/site map">
                  <button className={styles.btnFooter}>מפת האתר</button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
