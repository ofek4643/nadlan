import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

const AuthContext = createContext();
// משתנים
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [edit, setEdit] = useState(false);

  const [myFavoriteProperties, setMyFavoriteProperties] = useState([]);
  const didInitialFavoritesFetch = useRef(false);
  const [newAlertArray, setNewAlertArray] = useState([]);
  const [refreshAlerts, setRefreshAlerts] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // טעינת יוזר
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/users`, {
        withCredentials: true,
      });
      setUser(res.data);
      setIsAdmin(res.data.role === "admin");
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoadingUser(false);
    }
  }, [apiUrl]);

  // טעינת נכסים מעודפים
  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${apiUrl}/add-favorite`, {
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
        `${apiUrl}/add-favorite`,
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
      fetchFavorites();
    } catch (error) {
      console.error("שגיאה בעדכון המעודפים", error);
    }
  };
  // משנה את מצב העריכה של הנכסים שלי
  const toggleEdit = () => {
    setEdit(!edit);
  };

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

  // פונקציה לרענון התראות
  const triggerRefreshAlerts = () => {
    setRefreshAlerts((prev) => !prev);
  };

  // שליפת התראות חדשות עם ריענון אוטומטי
  useEffect(() => {
    if (!user) {
      setNewAlertArray([]);
      return;
    }
    async function fetchNewAlerts() {
      try {
        const res = await axios.get(`${apiUrl}/newAlerts`, {
          withCredentials: true,
        });
        setNewAlertArray(res.data.newAlerts);
      } catch (error) {
        console.error("שגיאה במשיכת התראות חדשות", error);
        setNewAlertArray([]);
      }
    }
    fetchNewAlerts();
  }, [apiUrl, refreshAlerts]);

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
        newAlertArray,
        setNewAlertArray,
        refreshAlerts,
        triggerRefreshAlerts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
