import styles from "../SearchProperty/SearchProperty.module.css";
import CustomSelect from "../../components/CustomSelect/CustomSelect.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Property from "../../components/Property/Property.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
const SearchProperty = () => {
  // משתנים של טעינה הודעה והאם פתוח הרשימה
  const [loading, setLoading] = useState(true);
  const [messageErrorFetchVisibility, setMessageErrorFetchVisibility] =
    useState(false);
  const messageErrorFetch = "אירעה שגיאה בטעינת הנתונים";

  const [isOpen, setIsOpen] = useState(false);

  // משתנים של חיפוש נכס
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [maxRooms, setMaxRooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  // משתנים של חיפוש מאפייני נכס
  const [furnished, setFurnished] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [parking, setParking] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [storage, setStorage] = useState(false);
  // שגיאות בחיפוש נכס
  const [priceError, setPriceError] = useState(false);
  const [roomsError, setRoomsError] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // בדיקת כמות עמודים לנכסים
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // המרת ערכים מ־string ל־number
  // על מנת שאוכל להשוואות בין מספרים
  const parsedMinSize = minSize ? parseInt(minSize) : 0;
  const parsedMaxSize = maxSize ? parseInt(maxSize) : Infinity;

  const parsedMinPrice = minPrice
    ? parseInt(minPrice.replace(/[^0-9]/g, ""))
    : 0;
  const parsedMaxPrice = maxPrice
    ? maxPrice.includes("+")
      ? Infinity
      : parseInt(maxPrice.replace(/[^0-9]/g, ""))
    : Infinity;

  const parsedMinRooms =
    minRooms === "5+" ? 5 : minRooms ? parseInt(minRooms) : 0;
  const parsedMaxRooms =
    maxRooms === "5+" ? Infinity : maxRooms ? parseInt(maxRooms) : Infinity;
    
  // בודקת אם יש סינון
  function hasFilters() {
    return (
      type !== "" ||
      city !== "" ||
      minRooms !== "" ||
      maxRooms !== "" ||
      minPrice !== "" ||
      maxPrice !== "" ||
      minSize !== "" ||
      maxSize !== "" ||
      status !== "" ||
      furnished ||
      airConditioning ||
      parking ||
      balcony ||
      elevator ||
      storage
    );
  }

  // שולח אותי ללמעלה בשינוי של עמוד
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [currentPage]);

  // שליפת הנכסים
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isFiltering) {
          // שליפה עם סינון
          const res = await axios.post(
            "http://localhost:5000/properties/filter",
            {
              type,
              city,
              minRooms: parsedMinRooms,
              maxRooms: parsedMaxRooms,
              minPrice: parsedMinPrice,
              maxPrice: parsedMaxPrice,
              minSize: parsedMinSize,
              maxSize: parsedMaxSize,
              status,
              furnished,
              airConditioning,
              parking,
              balcony,
              elevator,
              storage,
              sort,
              page: currentPage,
              limit: 9,
            }
          );

          setFilteredProperties(res.data.properties);
          setTotalPages(res.data.totalPages);
        } else {
          // שליפה רגילה
          const res = await axios.get("http://localhost:5000/properties", {
            params: {
              page: currentPage,
              limit: 9,
              sort,
            },
          });
          setAllProperties(res.data.properties);
          setFilteredProperties(res.data.properties);
          setTotalPages(res.data.totalPages);
        }

        setMessageErrorFetchVisibility(false);
      } catch (err) {
        console.error("שגיאה בטעינת נכסים:", err);
        setMessageErrorFetchVisibility(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, isFiltering, sort]);

  // בדיקה התחלתית עם השדות תקינים אם כן בודק אם הוא מנסה לסנן 
  async function filterProp() {
    let hasError = false;

    if (parsedMaxPrice < parsedMinPrice) {
      setPriceError(true);
      hasError = true;
    }
    if (parsedMaxRooms < parsedMinRooms) {
      setRoomsError(true);
      hasError = true;
    }
    if (parsedMaxSize < parsedMinSize) {
      setSizeError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setCurrentPage(1);
    setSort("")
    if (hasFilters()) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }

  // בדיקה האם השדות תקינים בזמן אמת
  useEffect(() => {
    if (parsedMaxSize >= parsedMinSize) {
      setSizeError(false);
    }
    if (parsedMaxPrice >= parsedMinPrice) {
      setPriceError(false);
    }
    if (parsedMaxRooms >= parsedMinRooms) {
      setRoomsError(false);
    }
  }, [
    parsedMaxSize,
    parsedMinSize,
    parsedMaxPrice,
    parsedMinPrice,
    parsedMaxRooms,
    parsedMinRooms,
  ]);
  return (
    <div>
      <div className={styles.allContainerSearchProperty}>
        <h2 className={styles.headerSearchProperty}>חיפוש נכסים</h2>
        <div className={styles.SearchProperty}>
          <div className={styles.containerSearchProperty}>
            <div className={styles.selectProperty}>
              <label className={styles.labelSelect} htmlFor="">
                סוג נכס
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
                className="custom-select"
                className2="select-btn"
                onChange={(value) => setType(value)}
              />
            </div>
            <div className={styles.selectProperty}>
              <label className={styles.labelSelect} htmlFor="">
                עיר
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
                className="custom-select"
                className2="select-btn"
                onChange={(value) => setCity(value)}
              />
            </div>
            <div className={styles.selectProperty}>
              <label className={styles.labelSelect} htmlFor="">
                חדרים
              </label>
              <div className={styles.halfSelect}>
                <CustomSelect
                  options={["", "1", "2", "3", "4", "5+"]}
                  placeholder="מינימום"
                  className="myCustomSelect1"
                  className2="select-btn-half1"
                  onChange={(value) => setMinRooms(value)}
                  error={roomsError}
                />
                <CustomSelect
                  options={["", "1", "2", "3", "4", "5+"]}
                  placeholder="מקסימום"
                  className="myCustomSelect2"
                  className2="select-btn-half2"
                  onChange={(value) => setMaxRooms(value)}
                  error={roomsError}
                />
              </div>
              <div className={styles.error}>
                {roomsError && (
                  <div className={styles.errorText}>
                    מינימום לא יכול להיות גדול יותר ממקסימום
                  </div>
                )}
              </div>
            </div>
            <div className={styles.selectProperty}>
              <label className={styles.labelSelect} htmlFor="">
                טווח מחירים
              </label>
              <div className={styles.halfSelect}>
                <CustomSelect
                  options={[
                    "",
                    "500,000 ₪",
                    "1,000,000 ₪",
                    "1,500,000 ₪",
                    "2,000,000 ₪",
                    "3,000,000 ₪",
                  ]}
                  placeholder="מינימום"
                  className="myCustomSelect1"
                  className2="select-btn-half1"
                  onChange={(value) => setMinPrice(value)}
                  error={priceError}
                />
                <CustomSelect
                  options={[
                    "",
                    "1,000,000 ₪",
                    "2,000,000 ₪",
                    "3,000,000 ₪",
                    "5,000,000 ₪",
                    "10,000,000+ ₪",
                  ]}
                  placeholder="מקסימום"
                  className="myCustomSelect2"
                  className2="select-btn-half2"
                  onChange={(value) => setMaxPrice(value)}
                  error={priceError}
                />
              </div>
              <div className={styles.error}>
                {priceError && (
                  <div className={styles.errorText}>
                    מינימום לא יכול להיות גדול ממקסימום
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.moreSearch}>
            <button
              className={styles.btnMoreSearch}
              onClick={() => setIsOpen(!isOpen)}
            >
              סינון מתקדם
              <span className="arrow">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className={styles.divMoreSearch}>
                <div>
                  <label htmlFor="">גודל במ"ר</label>
                  <div className={styles.divInput}>
                    <CustomInput
                      style={{
                        border: sizeError ? "1px solid red" : "1px solid #ccc",
                      }}
                      className={styles.input1}
                      type="number"
                      placeholder="מינימום"
                      min={0}
                      value={minSize}
                      onChange={(e) => setMinSize(e.target.value)}
                    />
                    <CustomInput
                      style={{
                        border: sizeError ? "1px solid red" : "1px solid #ccc",
                      }}
                      className={styles.input2}
                      type="number"
                      placeholder="מקסימום"
                      value={maxSize}
                      min={1}
                      onChange={(e) => setMaxSize(e.target.value)}
                    />
                  </div>
                  <div className={styles.error}>
                    {sizeError && (
                      <div className={styles.errorText}>
                        מינימום לא יכול להיות גדול ממקסימום
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="">מאפיינים</label>
                  <div className={styles.divCheckBox}>
                    <div className={styles.column}>
                      <label className={styles.checkboxLabel}>
                        <CustomInput
                          className={styles.checkBox}
                          type="checkbox"
                          checked={furnished}
                          onClick={() => setFurnished((prev) => !prev)}
                        />
                        מרוהט
                      </label>
                      <label className={styles.checkboxLabel}>
                        <CustomInput
                          className={styles.checkBox}
                          type="checkbox"
                          checked={airConditioning}
                          onClick={() => setAirConditioning((prev) => !prev)}
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
                          onClick={() => setParking((prev) => !prev)}
                        />
                        חניה
                      </label>
                      <label className={styles.checkboxLabel}>
                        <CustomInput
                          className={styles.checkBox}
                          type="checkbox"
                          checked={balcony}
                          onClick={() => setBalcony((prev) => !prev)}
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
                          onClick={() => setElevator((prev) => !prev)}
                        />
                        מעלית
                      </label>
                      <label className={styles.checkboxLabel}>
                        <CustomInput
                          className={styles.checkBox}
                          type="checkbox"
                          checked={storage}
                          onClick={() => setStorage((prev) => !prev)}
                        />
                        מחסן
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="">סטטוס</label>
                  <div className={styles.divRadio}>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        value=""
                        checked={status === ""}
                        name="type"
                        type="radio"
                        onChange={(e) => setStatus(e.target.value)}
                      />
                      הכל
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        value="להשכרה"
                        checked={status === "להשכרה"}
                        name="type"
                        type="radio"
                        onChange={(e) => setStatus(e.target.value)}
                      />
                      להשכרה
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput
                        value="למכירה"
                        checked={status === "למכירה"}
                        name="type"
                        type="radio"
                        onChange={(e) => setStatus(e.target.value)}
                      />
                      למכירה
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.btnSearchPropertyDiv}>
              <button onClick={filterProp} className={styles.btnSearchProperty}>
                🔍 חפש נכסים
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.SearchProperty}>
        <div className={styles.headerProperty}>
          <h2>
            {loading
              ? "טוען נכסים"
              : `נמצאו ${filteredProperties.length} נכסים`}
          </h2>
          <div className={styles.sortDiv}>
            <label htmlFor="">מיין לפי :</label>
            <CustomSelect
              options={[
                "הכי חדש",
                "מחיר(מהנמוך לגבוה)",
                "מחיר(מהגבוה לנמוך)",
                "שטח(מהנמוך לגבוה)",
                "שטח(מהגבוה לנמוך)",
              ]}
              className="myCustomSelect2"
              className2="select-btn-half2"
              placeholder="הכי חדש"
              value={sort}
              onChange={(value) => setSort(value)}
            />
          </div>
        </div>
        <div className={styles.containerProperties}>
          {loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
            <Property properties={filteredProperties} />
          )}
          {messageErrorFetchVisibility && (
            <div className={styles.errorMessage}>{messageErrorFetch}</div>
          )}
        </div>
        <div className={styles.pagination}>
          <button
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage === 1}
          >
            הקודם
          </button>
          {(() => {
            const buttons = [];
            for (let i = 1; i <= totalPages; i++) {
              buttons.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={currentPage === i ? styles.activePage : ""}
                >
                  {i}
                </button>
              );
            }
            return buttons;
          })()}
          <button
            onClick={() => {
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage >= totalPages}
          >
            הבא
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchProperty;
