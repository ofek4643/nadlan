import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./EditUser.module.css";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { labelStyle } from "../../data/data.js";

// דרישות סיסמא

const EditUser = () => {
  // id של היוזר הנבחר
  const { id } = useParams();
  // עריגה של המשתמש
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [submited, setSubmited] = useState(false);
  // שגיאות
  const [userNameError, setUserNameError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  // טעינה והודעות
  const [loading, setLoading] = useState(false);
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const timeoutRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // משיכת פרטי משתמש
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/users/${id}`, {
          withCredentials: true,
        });
        setFullName(res.data.fullName);
        setEmail(res.data.email || "");
        setPhoneNumber(res.data.phoneNumber || "");
        setUserName(res.data.userName || "");
      } catch (err) {
        console.error("שגיאה בשליפת המשתמש:", err);
      }
    };
    fetchUser();
  }, [id , apiUrl]);

  // עדכון פרטי המשתמש
  const saveHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${apiUrl}/admin/users/${id}`,
        { fullName, phoneNumber, email, userName },
        { withCredentials: true }
      );
      console.log(res.data);
      setShowMessageVisibilty(true);
      setShowMessage(res.data);
    } catch (error) {
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
      setLoading(false);
      setShowMessageVisibilty(false);
      setTimeout(() => {
        setShowMessageVisibilty(true);
      }, 10);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);
    }
  };
  // ברגע שנלחץ על הכפתור שמור
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmited(true);

    //בדיקת ראשונית של שגיאות
    let hasErrors = false;

    if (
      fullName.trim().length <= 3 ||
      fullName
        .trim()
        .split(" ")
        .filter((w) => w.length > 0).length < 2
    ) {
      setFullNameError(true);
      hasErrors = true;
    }
    if (userName.length <= 7 || userName.includes(" ")) {
      setUserNameError(true);
      hasErrors = true;
    }
    if (phoneNumber.length < 10) {
      setPhoneNumberError(true);
      hasErrors = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
      setEmailError(true);
      hasErrors = true;
    }
    if (hasErrors) {
      setShowMessageVisibilty(false);
      setTimeout(() => {
        setShowMessage("יש למלא את כל השדות בצורה תקינה");
        setShowMessageVisibilty(true);
      }, 10);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);

      return;
    }
    saveHandler();
  };
  // בדיקה בזמן אמת של שגיאות
  useEffect(() => {
    if (submited) {
      if (
        fullName.trim().length > 3 &&
        fullName
          .trim()
          .split(" ")
          .filter((w) => w.length > 0).length >= 2
      ) {
        setFullNameError(false);
      } else {
        setFullNameError(true);
      }
      if (userName.trim().length > 7 && !userName.includes(" ")) {
        setUserNameError(false);
      } else {
        setUserNameError(true);
      }
      if (phoneNumber.length >= 10) {
        setPhoneNumberError(false);
      } else {
        setPhoneNumberError(true);
      }
      if (/^[^\s@]+@[^\s@]+\.(com|co\.il)$/i.test(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
  }, [submited, fullName, userName, phoneNumber, email]);

  return (
    <div className={styles.containerSelected}>
      {showMessageVisibilty && (
        <div
          className={
            showMessage.includes("הצלחה")
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {showMessage}
        </div>
      )}
      <h2 className={styles.headerContainerSelected}>פרטים אישיים</h2>

      <form>
        <div className={styles.row}>
          <div className={styles.field}>
            <label style={labelStyle(userNameError)}>שם משתמש</label>
            <CustomInput
              value={userName}
              type="text"
              className={styles.input}
              onChange={(e) => setUserName(e.target.value)}
            />
            {userNameError && (
              <div className={styles.errorText}>
                שם משתמש חייב להכיל לפחות 8 תווים ובלי רווחים
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label style={labelStyle(emailError)}>אימייל</label>
            <CustomInput
              value={email}
              type="text"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <div className={styles.errorText}>איימל לא תקין</div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label style={labelStyle(fullNameError)}>שם מלא</label>
            <CustomInput
              value={fullName}
              type="text"
              className={styles.input}
              onChange={(e) => setFullName(e.target.value)}
            />
            {fullNameError && (
              <div className={styles.errorText}>
                שם מלא חייב להכיל לפחות 4 תווים ושתי מילים
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label style={labelStyle(phoneNumberError)}>מספר בטלפון</label>
            <CustomInput
              type="tel"
              placeholder="0501234567"
              inputMode="numeric"
              value={phoneNumber}
              pattern="[0-9]*"
              autoComplete="phoneNumber"
              className={styles.input}
              maxLength={10}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={(e) => {
                const allowed = [
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "Backspace",
                ];
                if (!allowed.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {phoneNumberError && (
              <div className={styles.errorText}>מספר טלפון לא תקין</div>
            )}
          </div>
        </div>
        <button
          onClick={onSubmit}
          type="submit"
          disabled={loading}
          className={loading ? styles.saveBtnLoading : styles.saveBtn}
        >
          {loading ? (
            <>
              <span>שומר...</span>
              <span className={styles.loadingSpinner}></span>
            </>
          ) : (
            "שמור שינויים"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
