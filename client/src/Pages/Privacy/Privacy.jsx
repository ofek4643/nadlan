import React from "react";
import styles from "../Privacy/Privacy.module.css";
const Privacy = () => {
  return (
    <div>
      <button
        onClick={() => {
          window.history.back();
          console.log(window.history);
          
        }}
        className={styles.backButton}
      >
        חזור
      </button>
      <div className={styles.warrper}>
        <div className={styles.card}>
          <div className={styles.page}>
            <h1 className={styles.title}>מדיניות פרטיות</h1>
            <p className={styles.subTitle}>
              אנו מחויבים לשמירה על פרטיות המשתמשים באתר ולשימוש אחראי במידע
              שנאסף.
            </p>

            <h2 className={styles.secendHeader}>1. מידע שנאסף</h2>
            <p>
              אנו אוספים מידע כגון פרטי יצירת קשר, פרטים על נכסים, נתוני גלישה
              ופעילות באתר כדי לשפר את השירות ולהתאים הצעות.
            </p>

            <h2 className={styles.secendHeader}>2. שימוש במידע</h2>
            <p>
              המידע ישמש לצורך ניהול חשבונות, שיפור חוויית המשתמש, שליחת עדכונים
              והצעות רלוונטיות.
            </p>

            <h2 className={styles.secendHeader}>3. שיתוף מידע</h2>
            <p>
              אנו לא נמכור או נחליף מידע אישי לצדדים שלישיים ללא הסכמתך, אלא אם
              כן הדבר נדרש על פי חוק או לצורך מתן השירות (כגון לשותפי תשלום או
              פרסום).
            </p>

            <h2 className={styles.secendHeader}>4. אבטחת מידע</h2>
            <p>
              המידע שלך מאובטח באמצעי הגנה טכנולוגיים וארגוניים בהתאם לסטנדרטים
              המקובלים בתעשייה.
            </p>

            <h2 className={styles.secendHeader}>5. זכויותיך</h2>
            <p>
              אתה יכול לבקש גישה, תיקון או מחיקה של המידע האישי שלך לפי חוק הגנת
              הפרטיות.
            </p>

            <h2 className={styles.secendHeader}>6. יצירת קשר</h2>
            <p>
              לשאלות בנוגע לפרטיות, ניתן לפנות אלינו בכתובת:
              support@realestate-example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
