import { Link, useNavigate } from "react-router-dom";
import styles from "../Property/Property.module.css";
import { useAuth } from "../../data/AuthContext";

const Property = ({ properties }) => {
  const navigate = useNavigate();

  const { user, toggleFavorite } = useAuth();
  const favorites = user?.favoriteProperties || [];

  return (
    <>
      {properties.map((item) => {
        const isFavorite = favorites.includes(item._id);

        return (
          <div key={item._id} className={styles.property}>
            <div
              style={{
                backgroundImage: item.imageUrl
                  ? `url("${item.imageUrl}")`
                  : "url('https://images.unsplash.com/photo-1627616010739-78ee1aacf431?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmlnJTIwaG9tZSUyMHdpdGglMjBnYXJkZW4lMjBwb29sfGVufDB8fDB8fHww')",
              }}
              className={styles.imgDiv}
            >
              <div className={styles.imgDivHeader}>
                <span
                  style={{
                    backgroundColor:
                      item.status === "להשכרה" ? "orange" : "hsl(222 47% 24%)",
                  }}
                  className={styles.title}
                >
                  {item.status}
                </span>
                <button
                  style={{
                    backgroundColor: isFavorite ? "orange" : "hsl(0, 0%, 67%)",
                    color: isFavorite ? "white" : "rgb(82 82 82)",
                  }}
                  onClick={() => {
                    if (user) {
                      toggleFavorite(item._id);
                    } else {
                      navigate("/login", { state: { showMessage: "עליך להתחבר על מנת להוסיף נכסים למעודפים" } });
                    }
                  }}
                  className={styles.addToFavorite}
                >
                  <i
                    className={
                      isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"
                    }
                  ></i>
                </button>
              </div>
            </div>
            <div className={styles.infoDiv}>
              <div className={styles.infoDivHeader}>
                <h3>{item.header}</h3>
                <p className={styles.infoPrice}>
                  {item.price
                    ? item.status === "להשכרה"
                      ? `${item.price.toLocaleString()} ₪ / לחודש`
                      : `${item.price.toLocaleString()} ₪`
                    : "מחיר לא זמין"}
                </p>
              </div>
              <p className={styles.addressProperty}>
                {`${item.neighborhood}, ${item.city}`}
              </p>
              <div className={styles.moreInfoProperty}>
                <p className={styles.moreInfo}>
                  <i
                    className={`${styles.moveIcon} fa-solid fa-ruler fa-rotate-90`}
                  ></i>
                  {`${item.size} מ"ר`}
                </p>
                <p className={styles.moreInfo}>
                  <i className={`${styles.moveIcon} fa-solid fa-bed`}></i>
                  {`${item.rooms} חדרים`}
                </p>
                <p className={styles.moreInfo}>
                  <i className={`${styles.moveIcon} fa-solid fa-bath`}></i>
                  {`${item.bathrooms} חדרי רחצה`}
                </p>
              </div>
              <div className={styles.callDiv}>
                <Link to={`/properties/prop/${item._id}`}>
                  <button className={styles.moreInfoBtn}>פרטים נוספים</button>
                </Link>
                <Link to={`formCallMe`}>
                  <button className={styles.callMeBtn}>צור קשר</button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Property;
