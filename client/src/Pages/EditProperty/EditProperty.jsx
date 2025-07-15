import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styles from "../EditProperty/EditProperty.module.css";
import { Link, useParams } from "react-router-dom";
import { labelStyle } from "../../data/data.js";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

const EditProperty = () => {
  const { id } = useParams();

  //משתנים של בדיקה ומידע של נכס

  const [header, setHeader] = useState("");
  const [headerError, setHeaderError] = useState(false);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);

  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState(false);

  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(false);

  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState(false);

  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);

  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodError, setNeighborhoodError] = useState(false);

  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState(false);

  const [houseNumber, setHouseNumber] = useState("");
  const [houseNumberError, setHouseNumberError] = useState(false);

  const [floor, setFloor] = useState(0);
  const [maxFloor, setMaxFloor] = useState(0);

  const [floorError, setFloorError] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  const [size, setSize] = useState(0);
  const [sizeError, setSizeError] = useState(false);

  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  //משתנים מאפייני נכס
  const [furnished, setFurnished] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [parking, setParking] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [storage, setStorage] = useState(false);

  //משתנים של הודעה
  const [showMessageVisibilty, setShowMessageVisibilty] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const timeoutRef = useRef(null);

  const [submited, setSubmited] = useState(false);

  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  //שולף את פרטי הנכס
  useEffect(() => {
    async function getProp() {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/propertyId/${id}`);
        setHeader(res.data.header);
        setDescription(res.data.description);
        setPrice(res.data.price);
        setStatus(res.data.status);
        setType(res.data.type);
        setCity(res.data.city);
        setNeighborhood(res.data.neighborhood);
        setStreet(res.data.street);
        setHouseNumber(res.data.houseNumber);
        setFloor(res.data.floor);
        setMaxFloor(res.data.maxFloor);
        setImageUrl(res.data.imageUrl);
        setSize(res.data.size);
        setRooms(res.data.rooms);
        setBathrooms(res.data.bathrooms);
        setFurnished(res.data.furnished);
        setAirConditioning(res.data.airConditioning);
        setParking(res.data.parking);
        setBalcony(res.data.balcony);
        setElevator(res.data.elevator);
        setStorage(res.data.storage);
      } catch (error) {
        console.error("שגיאה בשליפת נתוני נכס:", error);
      } finally {
        setLoading(false);
      }
    }
    getProp();
  }, [id , apiUrl]);
  async function submit() {
    setSubmited(true);

    // בדיקה ראשונית אם הוזנו ערכים תקינים
    let hasErrors = false;

    if (header.length <= 8 || !header.includes(" ")) {
      setHeaderError(true);
      hasErrors = true;
    }
    if (description.length <= 25) {
      setDescriptionError(true);
      hasErrors = true;
    }
    if (price <= 0) {
      setPriceError(true);
      hasErrors = true;
    }
    if (status === "") {
      setStatusError(true);
      hasErrors = true;
    }
    if (type === "") {
      setTypeError(true);
      hasErrors = true;
    }
    if (city === "") {
      setCityError(true);
      hasErrors = true;
    }
    if (neighborhood.trim().length <= 3) {
      setNeighborhoodError(true);
      hasErrors = true;
    }
    if (street.trim().length <= 1) {
      setStreetError(true);
      hasErrors = true;
    }
    if (isNaN(houseNumber)) {
      setHouseNumberError(true);
      hasErrors = true;
    }
    if (floor > maxFloor) {
      setFloorError(true);
      hasErrors = true;
    }
    if (size <= 0) {
      setSizeError(true);
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
    // אם הכל תקין מעדכן את הנכס
    try {
      setLoading(true);

      const res = await axios.put(
        `${apiUrl}/edit-property/${id}`,
        {
          header,
          description,
          price,
          status,
          type,
          city,
          neighborhood,
          street,
          houseNumber,
          floor,
          maxFloor,
          imageUrl,
          size,
          rooms,
          bathrooms,
          furnished,
          airConditioning,
          parking,
          balcony,
          elevator,
          storage,
        },
        { withCredentials: true }
      );
      console.log("התגובה מהשרת:", res.data);
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
  }
  // מבצע בזמן אמת אם השדות עדיין תקינים
  useEffect(() => {
    if (submited) {
      if (header.length > 8 && header.includes(" ")) {
        setHeaderError(false);
      } else {
        setHeaderError(true);
      }
      if (description.length > 25) {
        setDescriptionError(false);
      } else {
        setDescriptionError(true);
      }
      if (price > 0) {
        setPriceError(false);
      } else {
        setPriceError(true);
      }
      if (status !== "") {
        setStatusError(false);
      } else {
        setStatusError(true);
      }
      if (type !== "") {
        setTypeError(false);
      } else {
        setTypeError(true);
      }
      if (city !== "") {
        setCityError(false);
      } else {
        setCityError(true);
      }
      if (neighborhood.trim().length > 3) {
        setNeighborhoodError(false);
      } else {
        setNeighborhoodError(true);
      }
      if (street.trim().length > 1) {
        setStreetError(false);
      } else {
        setStreetError(true);
      }
      if (houseNumber.trim() !== "" && !isNaN(houseNumber)) {
        setHouseNumberError(false);
      } else {
        setHouseNumberError(true);
      }
      if (floor <= maxFloor) {
        setFloorError(false);
      } else {
        setFloorError(true);
      }
      if (size > 0) {
        setSizeError(false);
      } else {
        setSizeError(true);
      }
    }
  }, [
    submited,
    header,
    description,
    price,
    status,
    type,
    city,
    neighborhood,
    street,
    houseNumber,
    size,
    floor,
    maxFloor,
  ]);
  return (
    <div>
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
      <Link to="/my-profile" className={styles.divBackBtn}>
        <span>
          <i className="fa-solid fa-arrow-right"></i>
        </span>
        <span>חזרה לפרופיל</span>
      </Link>
      <div className={styles.warrper}>
        <div className={styles.allContainerAddProperty}>
          <h2 className={styles.headerAllContainerAddProperty}>
            פרסום נכס חדש
          </h2>

          <div className={styles.ContainerAddPropert}>
            <div className={styles.ContainerAddPropertFlex}>
              <div className={styles.form1}>
                <h3 className={styles.headerAddProperty}>מידע בסיסי</h3>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                    style={labelStyle(headerError)}
                  >
                    כותרת*
                  </label>
                  <CustomInput
                    type="text"
                    placeholder="דירת 4 חדרים מרווחת"
                    value={header}
                    className={styles.input}
                    onChange={(e) => setHeader(e.target.value)}
                  />
                  <div className={styles.error}>
                    {headerError && (
                      <div className={styles.errorText}>
                        הכותרת חייבת להכיל לפחות 8 תווים ושני מילים
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.field}>
                  <label
                    className={styles.label}
                    style={labelStyle(descriptionError)}
                  >
                    תיאור*
                  </label>
                  <textarea
                    type="text"
                    value={description}
                    placeholder="תאר את הנכס בפירוט: יתרונות, מיקום, שיפוצים וכו'"
                    className={styles.textAreaInput}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className={styles.error}>
                    {descriptionError && (
                      <div className={styles.errorText}>
                        התיאור חייב להכיל לפחות 25 תווים
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label
                      className={styles.label}
                      style={labelStyle(priceError)}
                    >
                      מחיר*
                    </label>
                    <CustomInput
                      type="number"
                      placeholder="מחיר"
                      className={styles.input}
                      value={price}
                      min={0}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <div className={styles.error}>
                      {priceError && (
                        <div className={styles.errorText}>
                          המחיר חייב להיות גדול מ-0
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label
                      className={styles.label}
                      style={labelStyle(statusError)}
                    >
                      סטטוס*
                    </label>
                    <CustomSelect
                      options={["", "למכירה", "להשכרה"]}
                      placeholder="סטטוס נכס"
                      className="custom-select-addProperty"
                      className2="select-btn-addProperty1"
                      value={status}
                      onChange={(value) => setStatus(value)}
                    />
                    <div className={styles.error}>
                      {statusError && (
                        <div className={styles.errorText}>
                          סטטוס זה שדה חובה
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} style={labelStyle(typeError)}>
                    סוג נכס*
                  </label>
                  <CustomSelect
                    options={[
                      "",
                      "דירה",
                      "בית פרטי",
                      "פנטהאוז",
                      "דירת גן",
                      "דופלקס",
                      "מגרש",
                      "מסחרי",
                    ]}
                    placeholder="בחר סוג נכס"
                    className="custom-select-addProperty"
                    className2="select-btn-addProperty"
                    value={type}
                    onChange={(value) => setType(value)}
                  />
                  <div className={styles.error}>
                    {typeError && (
                      <div className={styles.errorText}>
                        סוג נכס זה שדה חובה
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.form1}>
                <h3 className={styles.headerAddProperty}>מיקום</h3>
                <div className={styles.field}>
                  <label className={styles.label} style={labelStyle(cityError)}>
                    עיר*
                  </label>
                  <CustomSelect
                    options={[
                      "",
                      "תל אביב",
                      "ירושלים",
                      "חיפה",
                      "רעננה",
                      "הרצליה",
                      "רמת גן",
                      "באר שבע",
                    ]}
                    placeholder="בחר עיר"
                    className="custom-select-addProperty"
                    className2="select-btn-addProperty"
                    value={city}
                    onChange={(value) => setCity(value)}
                  />
                  <div className={styles.error}>
                    {cityError && (
                      <div className={styles.errorText}>עיר זה שדה חובה</div>
                    )}
                  </div>
                </div>
                <div className={styles.field}>
                  <label
                    className={styles.label}
                    style={labelStyle(neighborhoodError)}
                  >
                    שכונה*
                  </label>
                  <CustomInput
                    type="text"
                    placeholder="שכונה"
                    className={styles.input}
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                  <div className={styles.error}>
                    {neighborhoodError && (
                      <div className={styles.errorText}>
                        השכונה צריכה להיות יותר מ3 תווים
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label
                      className={styles.label}
                      style={labelStyle(streetError)}
                    >
                      רחוב*
                    </label>
                    <CustomInput
                      type="text"
                      placeholder="רחוב"
                      className={styles.input}
                      style={{
                        width: "250px",
                      }}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                    <div className={styles.error}>
                      {streetError && (
                        <div className={styles.errorText}>
                          הרחוב חייב להכיל לפחות 2 תווים
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label
                      className={styles.label}
                      style={labelStyle(houseNumberError)}
                    >
                      מספר בית*
                    </label>
                    <CustomInput
                      type="text"
                      placeholder="מספר בית"
                      className={styles.input}
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                    />
                    <div className={styles.error}>
                      {houseNumberError && (
                        <div className={styles.errorText}>
                          מספר בית הוא שדה חובה
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label
                      style={labelStyle(floorError)}
                      className={styles.label}
                    >
                      קומה*
                    </label>
                    <CustomInput
                      type="number"
                      placeholder="קומה"
                      className={styles.input}
                      value={floor}
                      min={0}
                      onChange={(e) => setFloor(e.target.value)}
                    />
                    <div className={styles.error}>
                      {floorError && (
                        <div className={styles.errorText}>
                          סה"כ קומות צריך להיות גדול מקומה
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>סה"כ קומות בבניין*</label>
                    <CustomInput
                      type="number"
                      placeholder="סך הכל קומות בבניין"
                      className={styles.input}
                      value={maxFloor}
                      min={0}
                      onChange={(e) => setMaxFloor(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>תמונת נכס</label>
                  <CustomInput
                    type="text"
                    placeholder="הדבק כתובת תמונה"
                    value={imageUrl || ""}
                    className={styles.input}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.ContainerAddPropertFlex}>
              <div
                style={{
                  width: "33%",
                }}
                className={styles.form1}
              >
                <h3 className={styles.headerAddProperty}>מאפייני הנכס</h3>

                <div className={styles.field}>
                  <label className={styles.label} style={labelStyle(sizeError)}>
                    גודל במ"ר*
                  </label>
                  <CustomInput
                    type="number"
                    placeholder="גודל נכס"
                    className={styles.input}
                    value={size}
                    min={0}
                    onChange={(e) => setSize(e.target.value)}
                  />
                  <div className={styles.error}>
                    {sizeError && (
                      <div className={styles.errorText}>
                        גודל נכס חייב להיות גדול מ-0
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>חדרים*</label>
                    <CustomInput
                      type="number"
                      placeholder="חדרים"
                      className={styles.input}
                      value={rooms}
                      min={0}
                      onChange={(e) => setRooms(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>חדרי רחצה*</label>
                    <CustomInput
                      type="number"
                      placeholder="חדרי רחצה"
                      className={styles.input}
                      value={bathrooms}
                      min={0}
                      onChange={(e) => setBathrooms(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "67%",
                }}
                className={styles.form1}
              >
                <h3 className={styles.headerAddProperty}>
                  תוספות ומאפיינים נוספים
                </h3>
                <div className={styles.divCheckBox}>
                  <div className={styles.column}>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        className={styles.checkBox}
                        type="checkbox"
                        checked={furnished}
                        onChange={() => setFurnished((prev) => !prev)}
                      />
                      מרוהט
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        className={styles.checkBox}
                        type="checkbox"
                        checked={airConditioning}
                        onChange={() => setAirConditioning((prev) => !prev)}
                      />
                      מיזוג
                    </label>
                  </div>
                  <div className={styles.column}>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        className={styles.checkBox}
                        type="checkbox"
                        checked={parking}
                        onChange={() => setParking((prev) => !prev)}
                      />
                      חניה
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        className={styles.checkBox}
                        type="checkbox"
                        checked={balcony}
                        onChange={() => setBalcony((prev) => !prev)}
                      />
                      מרפסת
                    </label>
                  </div>
                  <div className={styles.column}>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        className={styles.checkBox}
                        type="checkbox"
                        checked={elevator}
                        onChange={() => setElevator((prev) => !prev)}
                      />
                      מעלית
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        className={styles.checkBox}
                        type="checkbox"
                        checked={storage}
                        onChange={() => setStorage((prev) => !prev)}
                      />
                      מחסן
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.addPropertyFooter}>
              <div className={styles.containerButton}>
                <Link to="/my-profile">
                  <button className={styles.cancelBtn}>ביטול</button>
                </Link>
                <div>
                  <button
                    onClick={submit}
                    className={
                      loading
                        ? styles.postPropertyBtnLoading
                        : styles.postPropertyBtn
                    }
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span>מעדכן נכס...</span>
                        <span className={styles.loadingSpinner}></span>
                      </>
                    ) : (
                      "עדכון נכס"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
