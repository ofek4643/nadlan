import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./PropertyPage.module.css";

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  //שליפת נתוני הנכס הנבחר
  useEffect(() => {
    async function getProp() {
      try {
        const res = await axios.get(`http://localhost:5000/propertyId/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    }
    getProp();
  }, [id]);

  if (!property)
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    );
  return (
    <div>
      <Link to="/properties" className={styles.divBackBtn}>
        <span>
          <i className="fa-solid fa-arrow-right"></i>
        </span>
        <span>חזרה לרשימת נכסים</span>
      </Link>

      <div className={styles.pageContainer}>
        <div className={styles.imageWrapper}>
          <img
            src={
              property.imageUrl
                ? property.imageUrl
                : "https://images.unsplash.com/photo-1627616010739-78ee1aacf431?w=900&auto=format&fit=crop&q=60"
            }
            alt={property.header}
            className={styles.mainImage}
          />
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.title}>{property.header}</h1>
          <div className={styles.price}>
            💰 {property.price.toLocaleString()} ₪
          </div>
        </div>

        <section className={styles.descriptionSection}>
          <h2>תיאור הנכס</h2>
          <p>{property.description}</p>
        </section>

        <section className={styles.locationSection}>
          <h2>מיקום הנכס</h2>
          <div className={styles.detailsGrid}>
            <div>
              <strong>עיר:</strong> {property.city}
            </div>
            <div>
              <strong>שכונה:</strong> {property.neighborhood}
            </div>
            <div>
              <strong>רחוב:</strong> {property.street} {property.houseNumber}
            </div>
            <div>
              <strong>קומה:</strong> {property.floor}
            </div>
          </div>
        </section>

        <section className={styles.mainFeaturesSection}>
          <h2>מאפיינים עיקריים</h2>
          <div className={styles.detailsGrid}>
            <div>
              <strong>סטטוס:</strong> {property.status}
            </div>
            <div>
              <strong>גודל:</strong> {property.size} מ"ר
            </div>
            <div>
              <strong>חדרים:</strong> {property.rooms}
            </div>
            <div>
              <strong>שירותים:</strong> {property.bathrooms}
            </div>
          </div>
        </section>

        <section className={styles.additionalFeaturesSection}>
          <h2>מאפיינים נוספים</h2>
          <div className={styles.detailsGrid}>
            <div>
              <strong>מרוהט:</strong> {property.furnished ? "✔️" : "❌"}
            </div>
            <div>
              <strong>מזגן:</strong> {property.airConditioning ? "✔️" : "❌"}
            </div>
            <div>
              <strong>חניה:</strong> {property.parking ? "✔️" : "❌"}
            </div>
            <div>
              <strong>מרפסת:</strong> {property.balcony ? "✔️" : "❌"}
            </div>
            <div>
              <strong>מעלית:</strong> {property.elevator ? "✔️" : "❌"}
            </div>
            <div>
              <strong>מחסן:</strong> {property.storage ? "✔️" : "❌"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyPage;
