import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";
// הגדרת אובייקט קונטקסט גלובלי בשביל העברת נתונים לכל הפרויקט
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // משתנים
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [myFavoriteProperties, setMyFavoriteProperties] = useState([]);
  // פונקציה המעדכנת את המשתנה יוזר
  const fetchUser = async () => {
    try {
      setIsLoadingUser(true);
      const res = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };
  // מציג את הנכסים המעודפים שלי במידה ויש יוזר קיים
  const fetchFavorites = async () => {
    try {
      const res = await axios.get("http://localhost:5000/add-favorite", {
        withCredentials: true,
      });
      setMyFavoriteProperties(res.data);
      const favIds = res.data.map((p) => p._id);
      setUser((prev) => ({ ...prev, favoriteProperties: favIds }));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUser(null);
        setMyFavoriteProperties([]);
      } else {
        console.error("Error loading favorites", error);
      }
    }
  };
  // משנה את הנכסים המעודפים ואז קוראת לפונקציה feach כדי שתעדכן אותם
  const toggleFavorite = async (propertyId) => {
    if (!user) {
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/add-favorite",
        { propertyId },
        { withCredentials: true }
      );
      await fetchFavorites();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setMyFavoriteProperties([]);
    }
  }, [user]);

  return (
    // נותן את האפשרות לדפים להשתמש במשתנים
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        isLoadingUser,
        toggleFavorite,
        myFavoriteProperties,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
  //מקצרת את הקריאה בתוך הקומפוננטות 
export const useAuth = () => useContext(AuthContext);

