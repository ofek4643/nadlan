import React, { useEffect, useState } from "react";
import styles from "../MyProfile/MyProfile.module.css";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [myProfileActive, setMyProfileActive] = useState(true);
  const [myPropertiesActive, setmyPropertiesActive] = useState(false);
  const [myAlertsActive, setMyAlertsActive] = useState(false);
  const [myFavoriteActive, setMyFavoriteActive] = useState(false);

  const [alertArray, setAlertArray] = useState(null);
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch();
        const data = await res.json();
        setAlertArray(data.alerts);
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

  return (
    <div className={styles.warrper}>
      <div className={styles.NavProfile}>
        <div className={styles.headerNav}>
          <h2>איזור אישי</h2>
          <label className={styles.label}>
            <input className={styles.menu} type="checkbox" />☰
          </label>
        </div>
        <hr />
        <nav>
          <ul className={styles.List}>
            <Link to="/properties" className={styles.listItem}>
              <span>🏠︎</span>
              <span>נכסים</span>
            </Link>
            <Link className={styles.listItem}>
              <span>⚙</span>
              <span>הגדרות פרופיל</span>
            </Link>
            <Link to="/mortgage-calculator" className={styles.listItem}>
              <span>🗎</span>
              <span>מחשבון משכנתא</span>
            </Link>
            <Link to="/" className={styles.listItem}>
              <i class="fa-solid fa-right-from-bracket fa-rotate-180"></i>
              <span>חזרה לאתר</span>
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
          </button>
        </div>
        <div className={styles.containerSelected}>
          {myProfileActive && <div>profile</div>}
          {myPropertiesActive && <div>properties</div>}
          {myAlertsActive && (
            <div className={styles.containerAlert}>
              <h2 className={styles.headerAlert}>התראות</h2>
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
          {myFavoriteActive && <div>
            נכסים מעודפים
          </div> }
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
