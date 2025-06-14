import { Link } from "react-router-dom";
import styles from "../Property/Property.module.css";
import { useState } from "react";

const Property = ({ properties }) => {
  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(index) {
    if (favorites.includes(index)) {
      setFavorites(favorites.filter((favIndex) => favIndex !== index));
    } else {
      setFavorites([...favorites, index]);
    }
  }

  return (
    <>
      {properties.map((item, index) => {
        
        const isFavorite = favorites.includes(index);

        return (
          <div key={index} className={styles.property}>
            <div className={styles.imgDiv}>
              <div className={styles.imgDivHeader}>
                <span
                  style={{
                    backgroundColor: item.type === "להשכרה" ? "orange" : "hsl(222 47% 24%)"
                  }}
                  className={styles.title}
                >
                  {item.type}
                </span>
                <button
                  style={{
                    backgroundColor: isFavorite ? "orange" : "hsl(0, 0%, 67%)",
                    color: isFavorite ? "white" : "rgb(82 82 82)",
                  }}
                  onClick={() => toggleFavorite(index)}
                  className={styles.addToFavorite}
                >
                  <i className="fa-regular fa-heart"></i>
                </button>
              </div>
            </div>
            <div className={styles.infoDiv}>
              <div className={styles.infoDivHeader}>
                <h3>{item.title}</h3>
                <p className={styles.infoPrice}>{item.price}</p>
              </div>
              <p className={styles.addressProperty}>{item.address}</p>
              <div className={styles.moreInfoProperty}>
                <p className={styles.moreInfo}>
                  <i
                    className={`${styles.moveIcon} fa-solid fa-ruler fa-rotate-90`}
                  ></i>
                  {item.size}
                </p>
                <p className={styles.moreInfo}>
                  <i className={`${styles.moveIcon} fa-solid fa-bed`}></i>
                  {item.rooms}
                </p>
                <p className={styles.moreInfo}>
                  <i className={`${styles.moveIcon} fa-solid fa-bath`}></i>
                  {item.showers}
                </p>
              </div>
              <div className={styles.callDiv}>
                <Link to={`/properties/`}>
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
