import React, { useState } from "react";
import styles from "../AdminDashboard/AdminDashboard.module.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <div className={styles.warrper}>
      <div
        className={navCollapsed ? styles.smallNavProfile : styles.navProfile}
      >
        <div className={styles.headerNav}>
          {navCollapsed ? "" : <h2>ניהול מערכת</h2>}
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
              className={navCollapsed ? styles.smallListItem : styles.listItem}
              style={{ backgroundColor: "hsl(30, 100%, 60%)" }}
            >
              <span>📊</span>
              {navCollapsed ? "" : <span>לוח בקרה</span>}
            </Link>
            <Link
              to="/admin/users"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>👩‍👦</span>
              {navCollapsed ? "" : <span>ניהול משתמשים</span>}
            </Link>

            <Link
              to="/properties"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>🏠︎</span>
              {navCollapsed ? "" : <span>נכסים</span>}
            </Link>
            <Link
              to="/my-profile"
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
    </div>
  );
};

export default AdminDashboard;
