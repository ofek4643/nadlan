import React from "react";
import styles from "../Terms/Terms.module.css";
const Terms = () => {
  return (
    <div>
      <button
        onClick={() => {
          window.history.back();
        }}
        className={styles.backButton}
      >
        חזור
      </button>
      <div className={styles.warrper}>
        <div className={styles.card}>
          <div className={styles.page}>
            <h1 className={styles.title}>תנאי שימוש</h1>
            <p className={styles.subTitle}>
              השימוש באתר הנדל"ן שלנו מותנה בקבלת תנאי השימוש הבאים. אנא קראו
              אותם בעיון לפני השימוש באתר.
            </p>

            <h2 className={styles.secendHeader}>1. תוכן האתר</h2>
            <p>
              כל המידע על נכסים, מחירים, תיאורים ותמונות באתר הוא לצורכי מידע
              בלבד ואינו מהווה הצעה משפטית או התחייבות למכירה או השכרה.
            </p>

            <h2 className={styles.secendHeader}>2. אחריות המשתמש</h2>
            <p>
              אתה מתחייב להשתמש באתר בצורה חוקית, לא לפרסם תכנים פוגעניים או
              מטעות, ולא להפר זכויות של צדדים שלישיים.
            </p>

            <h2 className={styles.secendHeader}>3. הרשמה וחשבון משתמש</h2>
            <p>
              בעת הרשמה לאתר יש לספק מידע נכון ועדכני. המשתמש אחראי לשמירת
              סודיות פרטי ההתחברות שלו.
            </p>

            <h2 className={styles.secendHeader}>4. פרטיות ואבטחה</h2>
            <p>
              אנו משתמשים באמצעי אבטחה להגנת המידע שלך, אך אין ערובה לאבטחה
              מוחלטת של מידע המועבר דרך האינטרנט.
            </p>

            <h2 className={styles.secendHeader}>5. שינויים באתר ובתנאים</h2>
            <p>
              האתר שומר לעצמו את הזכות לשנות את תוכנו ואת תנאי השימוש בכל עת,
              והמשתמש מחויב לעקוב אחר עדכונים אלה.
            </p>

            <h2 className={styles.secendHeader}>6. הגבלת אחריות</h2>
            <p>
              האתר לא אחראי לנזקים ישירים או עקיפים שייגרמו משימוש באתר או
              מהסתמכות על מידע בו.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
