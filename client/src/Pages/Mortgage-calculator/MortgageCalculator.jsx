import React, { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput";
import styles from "../Mortgage-calculator/MortgageCalculator.module.css";

const MortgageCalculator = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [propertyMoney, setpropertyMoney] = useState(1500000);
  const [myMoney, setMyMoney] = useState(450000);
  const [years, setYears] = useState(20);
  const [percent, setPercent] = useState(3.5);
  const [primePercent, setPrimePercent] = useState(33);
  const [noChangePercent, setNoChangePercent] = useState(33);
  const [changePercent, setChangePercent] = useState(34);
  const [moneyMortgage, setMoneyMortgage] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  const [primeMonthly, setPrimeMonthly] = useState(0);
  const [noChangeMonthly, setNoChangeMonthly] = useState(0);
  const [changeMonthly, setChangeMonthly] = useState(0);

  const [submited, setSubmited] = useState(false);
  const [errorPercent, setErrorPercent] = useState(false);
  const [errorMoney, setErrorMoney] = useState(false);

  function calc() {
    setSubmited(true);
    let total =
      parseInt(primePercent) +
      parseInt(noChangePercent) +
      parseInt(changePercent);

    if (propertyMoney <= myMoney) {
      setErrorMoney(true);
      setMoneyMortgage(0);
      setMonthlyPayment(0);
      setTotalPayments(0);
      setTotalInterest(0);

      setPrimeMonthly(0);
      setNoChangeMonthly(0);
      setChangeMonthly(0);
      return;
    } else {
      setErrorMoney(false);
    }
    {
      console.log(moneyMortgage);
    }

    if (total === 100) {
      setErrorPercent(false);

      const loan = propertyMoney - myMoney;
      setMoneyMortgage(loan);

      const months = years * 12;

      const primeLoan = loan * (primePercent / 100);
      const fixedLoan = loan * (noChangePercent / 100);
      const changeLoan = loan * (changePercent / 100);

      const r = percent / 100 / 12;

      const calcMonthly = (principal) =>
        (principal * r) / (1 - Math.pow(1 + r, -months));

      const primeMonthlyPayment = calcMonthly(primeLoan);
      const fixedMonthlyPayment = calcMonthly(fixedLoan);
      const changeMonthlyPayment = calcMonthly(changeLoan);

      const totalMonthly =
        primeMonthlyPayment + fixedMonthlyPayment + changeMonthlyPayment;
      const totalPayments = totalMonthly * months;
      const totalInterest = totalPayments - loan;

      setMonthlyPayment(Math.round(totalMonthly));
      setTotalPayments(Math.round(totalPayments));
      setTotalInterest(Math.round(totalInterest));

      setPrimeMonthly(Math.round(primeMonthlyPayment));
      setNoChangeMonthly(Math.round(fixedMonthlyPayment));
      setChangeMonthly(Math.round(changeMonthlyPayment));
    } else {
      setMoneyMortgage(0);
      setMonthlyPayment(0);
      setTotalPayments(0);
      setTotalInterest(0);

      setPrimeMonthly(0);
      setNoChangeMonthly(0);
      setChangeMonthly(0);
      setErrorPercent(true);
    }
  }
  useEffect(() => {
    if (submited) {
      let total =
        parseInt(primePercent) +
        parseInt(noChangePercent) +
        parseInt(changePercent);

      if (total === 100) {
        setErrorPercent(false);
      } else {
        setErrorPercent(true);
      }
      if (propertyMoney >= myMoney) {
        setErrorMoney(false);
      }
    }
  }, [
    primePercent,
    noChangePercent,
    changePercent,
    submited,
    propertyMoney,
    myMoney,
  ]);

  const labelStyle = (error) => ({ color: error ? "red" : "black" });

  return (
    <div>
      <div className={styles.allContainerSearchProperty}>
        <h2 className={styles.headerCalculator}>מחשבון משכנתא</h2>
      </div>
      <div className={styles.btnContainer}>
        <button
          style={{
            backgroundColor: activeTab === "calculator" ? "#e0f2ff" : "#f1f1f1",
            color: activeTab === "calculator" ? "#003b5c" : "#666",
          }}
          onClick={() => setActiveTab("calculator")}
          className={styles.buttonHeader1}
        >
          מחשבון
        </button>
        <button
          style={{
            backgroundColor:
              activeTab === "information" ? "#e0f2ff" : "#f1f1f1",
            color: activeTab === "information" ? "#003b5c" : "#666",
          }}
          onClick={() => setActiveTab("information")}
          className={styles.buttonHeader2}
        >
          מידע שימושי
        </button>
      </div>
      <div className={styles.container}>
        {activeTab === "calculator" && (
          <div className={styles.calculatorContainer}>
            <div className={styles.formgroup}>
              <div className={styles.row}>
                <div className={styles.inputLabel}>
                  <label style={labelStyle(errorMoney)}>מחיר הנכס (₪)</label>
                  <CustomInput
                    className={styles.input}
                    type="number"
                    placeholder="הכנס את מחיר הנכס"
                    value={propertyMoney}
                    onChange={(e) => setpropertyMoney(e.target.value)}
                    min = {0}
                  />
                  
                  <div className={styles.error}>
                    {errorMoney && (
                      <div className={styles.errorText}>
                        מחיר הנכס לא יכול להיות קטן או שווה מהון מעצמי
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.inputLabel}>
                  <label style={labelStyle(errorMoney)}>הון עצמי (₪)</label>
                  <div>
                    <CustomInput
                      className={styles.input}
                      type="number"
                      placeholder="הכנס את ההון העצמי שלך"
                      value={myMoney}
                      onChange={(e) => setMyMoney(e.target.value)}
                      min={0}
                    />
                    <div className={styles.error}>
                      {errorMoney && (
                        <div className={styles.errorText}>
                          מחיר הנכס לא יכול להיות קטן או שווה מהון מעצמי
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputLabel}>
                  <label>תקופת המשכנתא (שנים)</label>
                  <CustomInput
                    min={5}
                    max={30}
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className={styles.inputRange}
                    type="range"
                  />
                  <div className={styles.rangeSubTitles}>
                    <span>5</span>
                    <span>{years} שנים</span>
                    <span>30</span>
                  </div>
                </div>
                <div className={styles.inputLabel}>
                  <label>ריבית שנתית (%)</label>
                  <CustomInput
                    min={1}
                    max={8}
                    step={0.1}
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    className={styles.inputRange}
                    type="range"
                  />
                  <div className={styles.rangeSubTitles}>
                    <span>1%</span>
                    <span>{percent}%</span>
                    <span>8%</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className={styles.headerTypeMortgage}>מסלולי משכנתא</h2>
                <div className={styles.TypeMortgage}>
                  <div
                    style={labelStyle(errorPercent)}
                    className={`${styles.inputLabel} ${styles.border}`}
                  >
                    <div className={styles.titleTypeMortgage}>
                      <label>פריים</label>
                      <span>{primePercent}%</span>
                    </div>
                    <CustomInput
                      min={0}
                      max={100}
                      value={primePercent}
                      onChange={(e) => setPrimePercent(e.target.value)}
                      className={styles.inputRangeSmall}
                      type="range"
                    />
                  </div>
                  <div
                    style={labelStyle(errorPercent)}
                    className={`${styles.inputLabel} ${styles.border}`}
                  >
                    <div className={styles.titleTypeMortgage}>
                      <label>קבועה צמודה</label>
                      <span>{noChangePercent}%</span>
                    </div>
                    <CustomInput
                      min={0}
                      max={100}
                      value={noChangePercent}
                      onChange={(e) => setNoChangePercent(e.target.value)}
                      className={styles.inputRangeSmall}
                      type="range"
                    />
                  </div>
                  <div
                    style={labelStyle(errorPercent)}
                    className={`${styles.inputLabel} ${styles.border}`}
                  >
                    <div className={styles.titleTypeMortgage}>
                      <label>משתנה לא צמודה</label>
                      <span>{changePercent}%</span>
                    </div>
                    <CustomInput
                      min={0}
                      max={100}
                      value={changePercent}
                      onChange={(e) => setChangePercent(e.target.value)}
                      className={styles.inputRangeSmall}
                      type="range"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button onClick={calc} className={styles.btnCalculator}>
                  חשב משכנתא
                </button>
                <div className={styles.error}>
                  {errorPercent && (
                    <div className={styles.errorText}>
                      האחוזים של שלושת מסלולי המשכנתא חייבים להיות 100%
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.resultInfoContainer}>
              <h3>תוצאות המשכנתא</h3>
              <div className={styles.resultInfo}>
                <span>סכום המשכנתא:</span>
                <span>{moneyMortgage.toLocaleString()}₪</span>
              </div>
              <div className={styles.resultInfo}>
                <span>תשלום חודשי:</span>
                <span>{monthlyPayment.toLocaleString()}₪</span>
              </div>
              <div className={styles.resultInfo}>
                <span>סה"כ ריבית:</span>
                <span>{totalInterest.toLocaleString()}₪</span>
              </div>
              <div className={styles.resultInfo}>
                <span>סה"כ תשלומים:</span>
                <span>{totalPayments.toLocaleString()}₪</span>
              </div>
              <h4 className={styles.secendHeader}>החזר חודשי לפי מסלולים</h4>
              <div className={styles.resultInfo}>
                <span>פריים:</span>
                <span>{primeMonthly.toLocaleString()}₪</span>
              </div>
              <div className={styles.resultInfo}>
                <span>קבועה צמודה:</span>
                <span>{noChangeMonthly.toLocaleString()}₪</span>
              </div>
              <div className={styles.resultInfo}>
                <span>משתנה לא צמודה:</span>
                <span>{changeMonthly.toLocaleString()}₪</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "information" && (
          <div className={styles.mortgageContainer}>
            <h2 className={styles.title}>מידע על משכנתאות</h2>

            <div className={styles.note}>
              <div>
                <i
                  className={`fa-solid fa-circle-exclamation ${styles.icon}`}
                ></i>
              </div>
              <div className={styles.noteInfo}>
                <strong>חשוב לדעת:</strong> המחשבון ניתן להערכה כללית בלבד.
                מומלץ להתייעץ עם יועץ משכנתאות מוסמך לפני קבלת החלטות.
              </div>
            </div>

            <h3 className={styles.subtitle}>סוגי מסלולי משכנתא</h3>
            <ul className={styles.list}>
              <li className={styles.ofek}>
                פריים: ריבית משתנה בהתאם לריבית בנק ישראל. בדרך כלל נמוכה יותר,
                אך יכולה להשתנות לאורך תקופת ההלוואה.
              </li>
              <li>
                קבועה צמודה: ריבית קבועה הצמודה למדד המחירים לצרכן. מספקת יציבות
                בתשלומים, אך עשויה להיות גבוהה יותר בטווח הארוך.
              </li>
              <li>
                משתנה לא צמודה: ריבית משתנה שאינה צמודה למדד. מתעדכנת בפרקי זמן
                קבועים (בד"כ בין 1-5 שנים).
              </li>
            </ul>

            <h3 className={styles.subtitle}>יתרונות משכנתא "מעורבבת"</h3>
            <p className={styles.paragraph}>
              משכנתא המשלבת מספר מסלולים שונים עשויה לספק את היתרונות הבאים:
            </p>
            <ul className={styles.list}>
              <li>פיזור סיכונים בין מסלולים שונים</li>
              <li>הקטנת החשיפה לשינויים בריבית ובמדד</li>
              <li>התאמה טובה יותר לצרכים האישיים וליכולת ההחזר</li>
              <li>אפשרות לבצע מחזור משכנתא על חלק מההלוואה בלבד</li>
            </ul>

            <h3 className={styles.subtitle}>טיפים לבחירת משכנתא</h3>
            <ul className={styles.list}>
              <li>
                בדקו את יכולת ההחזר החודשית שלכם לטווח ארוך, לא רק בטווח המיידי
              </li>
              <li>
                שימו לב לעלויות הנלוות: עמלות פתיחת תיק, ביטוחים, שמאות ועוד
              </li>
              <li>
                השוו הצעות ממספר בנקים - התחרות יכולה להוביל לתנאים טובים יותר
              </li>
              <li>
                שיקלו לקחת יועץ משכנתאות - הידע המקצועי שלו יכול לחסוך לכם כסף
                רב
              </li>
              <li>וודאו כי יש אפשרות לפירעון מוקדם ללא קנסות משמעותיים</li>
            </ul>

            <h3 className={styles.subtitle}>מושגים חשובים</h3>
            <ul>
              <li className={styles.listItem}>
                <strong>LTV (Loan to Value):</strong> היחס בין סכום המשכנתא
                לשווי הנכס. משפיע על גובה הריבית והתנאים.
              </li>
              <li className={styles.listItem}>
                <strong>החזר-הכנסה:</strong> היחס בין ההחזר החודשי להכנסה
                החודשית. רצוי שלא יעלה על 30%.
              </li>
              <li className={styles.listItem}>
                <strong>גרייס:</strong> תקופה בה משלמים ריבית בלבד, ללא החזר
                קרן.
              </li>
              <li className={styles.listItem}>
                <strong>מחזור משכנתא:</strong> החלפת משכנתא קיימת בהלוואה חדשה
                בתנאים טובים יותר.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;
