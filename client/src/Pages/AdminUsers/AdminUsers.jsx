import React, { useEffect, useRef, useState } from "react";
import styles from "../AdminUsers/AdminUsers.module.css";
import { Link } from "react-router-dom";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import axios from "axios";

const AdminUsers = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [myId, setMyId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [confirmMessageDelete, setConfirmMessageDelete] = useState(false);
  const [confirmMessageBlock, setConfirmMessageBlock] = useState(false);
  const [saveUserId, setSaveUserId] = useState(null);
  const [isBlock, setIsBlock] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const timeoutRef = useRef(null);
  // מושך נתוני של כל המשתמשים
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:5000/getAllUsers", {
          withCredentials: true,
        });
        setUsers(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        if (!error.response) {
          setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
        } else {
          setShowMessage(
            error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
          );
        }
      }
    }
    fetchUsers();
  }, []);
  // מושך את הid שלי להשוואה
  useEffect(() => {
    async function getUserId() {
      try {
        const res = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        });
        setMyId(res.data._id);
      } catch (error) {
        console.log(error);
      }
    }
    getUserId();
  }, []);

  // בודק בזמן אמת את החיפוש של המשתמשים
  useEffect(() => {
    const search = value.trim().toLowerCase();
    if (!search) {
      setFilteredUsers(users);
      return;
    }
    const result = users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(search)) ||
        (u.email && u.email.toLowerCase().includes(search))
    );
    setFilteredUsers(result);
  }, [value, users]);

  // מחיקת משתמש
  const deleteUserConfirm = async (userId) => {
    if (myId === userId) {
      setShowMessage("לא ניתן למחוק את המשתמש שמחובר כרגע.");
      setConfirmMessageDelete(false);
      setSaveUserId(null);
      setShowMessageVisibilty(false);
      setTimeout(() => {
        setShowMessageVisibilty(true);
      }, 10);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);
      return;
    }
    // אם אין שגיאות אז תמחק את היוזר
    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:5000/deleteUser/${userId}`,
        {
          withCredentials: true,
        }
      );
      setUsers(users.filter((i) => i._id !== userId));
      setFilteredUsers(filteredUsers.filter((i) => i._id !== userId));
      setShowMessage(res.data.message);
    } catch (error) {
      console.log(error);
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
      setLoading(false);
      setConfirmMessageDelete(false);
      setSaveUserId(null);
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
  // חוסם משתמש
  const blockUserConfirm = async (userId) => {
    if (myId === userId) {
      setShowMessage("לא ניתן לחסום את המשתמש שמחובר כרגע.");
      setConfirmMessageBlock(false);
      setSaveUserId(null);
      setShowMessageVisibilty(false);
      setTimeout(() => {
        setShowMessageVisibilty(true);
      }, 10);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowMessageVisibilty(false);
        timeoutRef.current = null;
      }, 3000);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/blockUser/${userId}`,
        {},
        { withCredentials: true }
      );
      setShowMessage(res.data.message);
      setIsBlock((prev) => !prev);
    } catch (error) {
      console.log(error);
      if (!error.response) {
        setShowMessage("לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        setShowMessage(
          error.response.data.error || "אירעה שגיאה בשרת, נסה שוב מאוחר יותר."
        );
      }
    } finally {
      setLoading(false);
      setConfirmMessageBlock(false);
      setSaveUserId(null);
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
  return (
    <div className={styles.warrper}>
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
              to="/admin/dashboard"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>📊</span>
              {navCollapsed ? "" : <span>לוח בקרה</span>}
            </Link>
            <Link
              className={navCollapsed ? styles.smallListItem : styles.listItem}
              style={{ backgroundColor: "hsl(30, 100%, 60%)" }}
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
      <div className={styles.containerAllUsers}>
        <h2 className={styles.headerUsers}>ניהול משתמשים</h2>
        <div className={styles.containerUsers}>
          <h2 className={styles.headerContainerSelected}>ניהול משתמשים</h2>
          <CustomInput
            className={styles.input}
            type="text"
            placeholder="חפש משתמשים..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className={styles.containerRoleUsers}>
            {filteredUsers.length === 0 ? (
              <p className={styles.noResults}>לא נמצאו משתמשים</p>
            ) : (
              filteredUsers.map((user) => (
                <div className={styles.user} key={user._id}>
                  <div className={styles.flex}>
                    <div className={styles.firstLetter}>
                      {user.fullName?.charAt(0) || ""}
                    </div>
                    <div className={styles.info}>
                      <span>{user.fullName}</span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className={styles.containerButton}>
                    <Link to={`/admin/users/${user._id}/edit`}>
                      <button title="ערוך משתמש" className={styles.button}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setFullName(user.fullName);
                        setSaveUserId(user._id);
                        setConfirmMessageBlock(true);
                      }}
                      title="חסום משתמש"
                      className={styles.button}
                    >
                      <i className="fa-solid fa-ban" />
                    </button>
                    <button
                      onClick={() => {
                        setFullName(user.fullName);
                        setSaveUserId(user._id);
                        setConfirmMessageDelete(true);
                      }}
                      title="מחק משתמש"
                      className={styles.button}
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              ))
            )}
            {confirmMessageDelete && saveUserId && (
              <div className={styles.backdrop}>
                <div className={styles.popout}>
                  <h2 className={styles.headerPopout}>מחיקת משתמש</h2>
                  <p>
                    האם אתה בטוח שברצונך למחוק את {fullName}? פעולה זו תמחק גם
                    את כל הנכסים השייכים למשתמש זה. פעולה זו לא ניתנת לביטול.
                  </p>
                  <div className={styles.actions}>
                    <button
                      disabled={loading}
                      className={styles.delete}
                      onClick={() => {
                        setConfirmMessageDelete(false);
                        setSaveUserId(null);
                      }}
                    >
                      ביטול
                    </button>
                    <button
                      onClick={() => deleteUserConfirm(saveUserId)}
                      className={loading ? styles.dangerLoading : styles.danger}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span>מוחק....</span>
                          <span className={styles.loadingSpinner}></span>
                        </>
                      ) : (
                        "מחק"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {confirmMessageBlock && saveUserId && (
              <div className={styles.backdrop}>
                <div className={styles.popout}>
                  <h2 className={styles.headerPopout}>חסימת משתמש</h2>
                  <p>
                    האם אתה בטוח שברצונך לחסום את {fullName}? משתמש חסום לא יוכל
                    להתחבר למערכת.
                  </p>
                  <div className={styles.actions}>
                    <button
                      disabled={loading}
                      className={styles.delete}
                      onClick={() => {
                        setConfirmMessageBlock(false);
                        setSaveUserId(null);
                      }}
                    >
                      ביטול
                    </button>
                    <button
                      onClick={() => blockUserConfirm(saveUserId)}
                      className={loading ? styles.dangerLoading : styles.danger}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span>{isBlock ? "משחרר..." : "חוסם..."}</span>
                          <span className={styles.loadingSpinner}></span>
                        </>
                      ) : isBlock ? (
                        "שחרר חסימה"
                      ) : (
                        "חסום"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
