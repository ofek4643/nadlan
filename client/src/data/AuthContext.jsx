import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [edit , setEdit] = useState(false)
  const [myFavoriteProperties, setMyFavoriteProperties] = useState([]);
  const didInitialFavoritesFetch = useRef(false);
  const [isAdmin , setIsAdmin] = useState(false)

  // טעינת יוזר
  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      const res = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      setUser(res.data);
      setIsAdmin(res.data.role === "admin" ? true : false)      
    } catch {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // טעינת נכסים מעודפים
  const fetchFavorites = async () => {
    try {
      const res = await axios.get("http://localhost:5000/add-favorite", {
        withCredentials: true,
      });
      setMyFavoriteProperties(res.data);

      const favIds = res.data.map((p) => p._id);
      setUser((prev) => {
        return { ...prev, favoriteProperties: favIds };
      });
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        setMyFavoriteProperties([]);
      } else {
        console.error("שגיאה בטעינת המעודפים", error);
      }
    }
  };

  // פונקציה המשנה את הנכס למועדף או לא
  const toggleFavorite = async (propertyId) => {
    if (!user) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/add-favorite",
        { propertyId },
        { withCredentials: true }
      );

      const updatedIds = res.data;
      setUser((prev) => {
        return { ...prev, favoriteProperties: updatedIds };
      });

      setMyFavoriteProperties((prev) =>
        prev.filter((p) => updatedIds.includes(p._id))
      );
      fetchFavorites()
    } catch (error) {
      console.error("שגיאה בעדכון המעודפים", error);
    }
  };

  const toggleEdit = () => {
      setEdit(!edit)
  }

  // טוען את היוזר בכל פעם שיש שבו שינוי
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // טען מועדפים רק פעם אחת אחרי שהיוזר נטען
  useEffect(() => {
    if (user && !didInitialFavoritesFetch.current) {
      fetchFavorites();
      didInitialFavoritesFetch.current = true;
    } else if (!user) {
      setMyFavoriteProperties([]);
      didInitialFavoritesFetch.current = false;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        isLoadingUser,
        toggleFavorite,
        myFavoriteProperties,
        setMyFavoriteProperties,
        isAdmin,
        toggleEdit,
        edit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
