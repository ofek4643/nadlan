import React from "react";
import { Link } from "react-router-dom";
import styles from "../AddProperty/AddProperty.module.css";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import CustomSelect from "../../components/CustomSelect/CustomSelect.jsx";
import { labelStyle } from "../../data/properties.js";

const AddProperty = () => {
  return (
    <div>
      <Link to="/properties" className={styles.divBackBtn}>
        <span>
          <i className="fa-solid fa-arrow-right"></i>
        </span>
        <span>חזרה לרשימת נכסים</span>
      </Link>
      <div className={styles.warrper}>
        <div className={styles.allContainerAddProperty}>
          <h2 className={styles.headerAllContainerAddProperty}>
            פרסום נכס חדש
          </h2>

          <div className={styles.rulesContainer}>
            <h3 className={styles.headerRulesContainer}>הנחיות לפרסום נכס</h3>
            <ul className={styles.listRulesContainer}>
              <li className={styles.listItem}>
                מלא את כל שדות החובה המסומנים ב-*
              </li>
              <li className={styles.listItem}>
                תיאור מפורט ותמונות איכותיות יגדילו את סיכויי המכירה/השכרה
              </li>
              <li className={styles.listItem}>
                ציין את כל המאפיינים החשובים של הנכס
              </li>
              <li className={styles.listItem}>
                וודא שהמחיר שהזנת הוא המחיר הנכון והסופי
              </li>
              <li className={styles.listItem}>
                המודעה תפורסם לאחר אישור צוות האתר, תהליך שעשוי לקחת עד 24 שעות
              </li>
            </ul>
          </div>
          <div className={styles.ContainerAddPropert}>
            <div className={styles.form1}>
              <h3 className={styles.headerAddProperty}>מידע בסיסי</h3>

              <div className={styles.field}>
                <label className={styles.label} style={labelStyle()}>
                  כותרת*
                </label>
                <CustomInput
                  type="text"
                  placeholder="דירת 4 חדרים מרווחת"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} style={labelStyle()}>
                  תיאור*
                </label>
                <textarea
                  type="text"
                  placeholder="תאר את הנכס בפירוט: יתרונות, מיקום, שיפוצים וכו'"
                  className={styles.textAreaInput}
                />
              </div>
            </div>
            <div className={styles.form1}>
              <h3 className={styles.headerAddProperty}>מיקום</h3>
              <div className={styles.field}>
                <label className={styles.label} style={labelStyle()}>
                  עיר*
                </label>
                <CustomSelect
                  options={[
                    "",
                    "תל אביב",
                    "ירושלים",
                    "חיפה",
                    "רעננה",
                    "הרצליה",
                    "רמת גן",
                    "באר שבע",
                  ]}
                  className="custom-select-addProperty"
                  className2="select-btn-addProperty"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} style={labelStyle()}>
                  שכונה*
                </label>
                <CustomInput
                  type="text"
                  placeholder="שכונה"
                  className={styles.input}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                <label className={styles.label} style={labelStyle()}>
                  שכונה*
                </label>
                <CustomInput
                  type="text"
                  placeholder="שכונה"
                  className={styles.input}
                  style = {{
                    width: "250px"
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} style={labelStyle()}>
                  שכונה*
                </label>
                <CustomInput
                  type="text"
                  placeholder="שכונה"
                  className={styles.input}
                />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
