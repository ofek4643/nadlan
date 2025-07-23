import Header from "../Header/Header.jsx";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
import { useAuth } from "../../data/AuthContext.jsx";
import styles from "./Layout.module.css";

const Layout = () => {
  // משתנים
  const location = useLocation();
  const { isLoadingUser } = useAuth();
  // רק לדף הפרופעל לא רוצה הגבלות
  const isFullWidth =
    location.pathname === "/my-profile" ||
    location.pathname === "/admin/users" ||
    location.pathname === "/admin/dashboard";
  const mainStyle = isFullWidth
    ? { width: "100%" }
    : { padding: "40px 0", margin: "0 auto", maxWidth: "1500px" };

  // בודק האם הוא מטעין את היוזר אם כן יציג טעינה
  if (isLoadingUser) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner} />
        <span>טוען נתונים...</span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={mainStyle}>
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
