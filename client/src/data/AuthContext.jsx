import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

// הגדרת אובייקט קונטקסט גלובלי בשביל העברת נתונים לכל הפרויקט
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // משתנים
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [myFavoriteProperties, setMyFavoriteProperties] = useState([]);

  // פונקציה שמטענת את המשתמש
  const fetchUser = useCallback(async () => {
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
  }, []);

  // פונקציה שמטענת את הנכסים המעודפים
  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/add-favorite", {
        withCredentials: true,
      });
      setMyFavoriteProperties(res.data);

      const favIds = res.data.map((p) => p._id);

      setUser((prev) => {
        const currentFavs = prev?.favoriteProperties || [];
        const sameFavs =
          currentFavs.length === favIds.length &&
          currentFavs.every((id) => favIds.includes(id));

        if (sameFavs) return prev; // לא מעדכן כדי לא ליצור לולאה אינסופית

        return { ...prev, favoriteProperties: favIds };
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUser(null);
        setMyFavoriteProperties([]);
      } else {
        console.error("Error loading favorites", error);
      }
    }
  }, []);

  // פונקציה שמוסיפה או מסירה נכס מעודף
  const toggleFavorite = async (propertyId) => {
  if (!user) return;
  try {
    const res = await axios.post(
      "http://localhost:5000/add-favorite",
      { propertyId },
      { withCredentials: true }
    );

    // אל תעדכן את ה-user כאן, רק את המועדפים
    setMyFavoriteProperties((prev) =>
      prev.filter((p) => res.data.includes(p._id))
    );
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
};

  // בטעינה הראשונית טוענים את המשתמש
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // בכל שינוי של המשתמש נטען את המועדפים או מאפסים אותם
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setMyFavoriteProperties([]);
    }
  }, [user, fetchFavorites]);

  return (
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

// מקצרת את הקריאה בתוך הקומפוננטות
export const useAuth = () => useContext(AuthContext);