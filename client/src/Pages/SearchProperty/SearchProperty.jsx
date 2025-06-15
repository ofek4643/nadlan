import styles from "../SearchProperty/SearchProperty.module.css";
import CustomSelect from "../../components/CustomSelect/CustomSelect.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx"
import allProperties from "../../data/properties.js";
import Property from "../../components/Property/Property.jsx";

import { useEffect, useState } from "react";
const SearchProperty = () => {
  //useState - passwordBtn
  const [isOpen, setIsOpen] = useState(false);

  //useState - errorFilter
  const [priceError, setPriceError] = useState(false);
  const [roomsError, setRoomsError] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  //useStates - filter
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [baseFilteredProperties, setBaseFilteredProperties] = useState(allProperties);
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [maxRooms, setMaxRooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");


  // useStates - page
  const [currentPage, setCurrentPage] = useState(1);

  // culc pages
  const propertiesPerPage = 9;
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  //variablesFilterSize
  const parsedMinSize = minSize ? parseInt(minSize) : 0;
  const parsedMaxSize = maxSize ? parseInt(maxSize) : Infinity;

  //variablesFilterPrice
  const parsedMinPrice = minPrice
      ? parseInt(minPrice.replace(/[^0-9]/g, ""))
      : 0;
    const parsedMaxPrice = maxPrice
      ? maxPrice.includes("+")
        ? Infinity
        : parseInt(maxPrice.replace(/[^0-9]/g, ""))
      : Infinity;

    //variablesFilterRooms
    const parsedMinRooms =
      minRooms === "5+" ? 5 : minRooms ? parseInt(minRooms) : 0;
    const parsedMaxRooms =
      maxRooms === "5+" ? Infinity : maxRooms ? parseInt(maxRooms) : Infinity;

  //checkWhenInputIsOk
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
  }, [parsedMaxSize, parsedMinSize,parsedMaxPrice,parsedMinPrice,parsedMaxRooms,parsedMinRooms]);
  
  //Sort
  useEffect(() => {
    const sorted = [...baseFilteredProperties]
    if (sort === "מחיר(מהנמוך לגבוה)") {
       sorted.sort((a,b) => parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, "")))
    }
    else if (sort === "מחיר(מהגבוה לנמוך)") {
       sorted.sort((a,b) => parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, "")))
    }
    else if (sort === "שטח(מהנמוך לגבוה)"){
      sorted.sort((a,b) => parseInt(a.size.replace(/[^0-9]/g, "")) - parseInt(b.size.replace(/[^0-9]/g, "")))
    }
    else if (sort === "שטח(מהגבוה לנמוך)") {
       sorted.sort((a,b) => parseInt(b.size.replace(/[^0-9]/g, "")) - parseInt(a.size.replace(/[^0-9]/g, "")))
    }

    setFilteredProperties(sorted);
    setCurrentPage(1)
  },[sort ,baseFilteredProperties])
  // functions
  function filterProp() {

    //variableError
    let hasError = false;

    //errorcheckIf
    if (parsedMaxPrice < parsedMinPrice) {
      setPriceError(true);
      hasError = true;
    }
    //checkErrorRoomsFilter
    if (parsedMaxRooms < parsedMinRooms) {
      setRoomsError(true);
      hasError = true;
    }
    //checkErrorSizeFilter
    if (parsedMaxSize < parsedMinSize) {
      setSizeError(true);
      hasError = true;
    }

    if (hasError) {
      setFilteredProperties(filteredProperties);
      setCurrentPage(1);
      return;
    }

    //filter
      const filtered = allProperties.filter((property) => {
      const matchesTitle = title ? property.title.includes(title) : true;
      const matchesCity = city ? property.title.includes(city) : true;

      const propertyRooms = parseInt(property.rooms);
 
      const matchesRooms =
        propertyRooms >= parsedMinRooms && propertyRooms <= parsedMaxRooms;

      const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ""));

      const matchesPrice =
        propertyPrice >= parsedMinPrice && propertyPrice <= parsedMaxPrice;

      const propertySize = parseInt(
        property.size.slice(0, property.size.indexOf(" "))
      );

      const matchesSize =
        propertySize >= parsedMinSize && propertySize <= parsedMaxSize;

      const matchesType = type ? property.type.includes(type) : true;
      return (
        matchesTitle &&
        matchesCity &&
        matchesRooms &&
        matchesPrice &&
        matchesSize &&
        matchesType
      );
    });
    setSort("");
    setBaseFilteredProperties(filtered);
    setCurrentPage(1);
  }
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
                onChange={(value) => setTitle(value)}
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
              <p className={styles.error}>
                {roomsError && (
                  <div className={styles.errorText}>
                    לא ניתן לסנן כאשר המקסימום קטן מהמינימום
                  </div>
                )}
              </p>
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
              <p className={styles.error}>
                {priceError && (
                  <div className={styles.errorText}>
                    לא ניתן לסנן כאשר המקסימום קטן מהמינימום
                  </div>
                )}
              </p>
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
                      onChange={(e) => setMinSize(e.target.value)}
                    />
                    <CustomInput
                      style={{
                        border: sizeError ? "1px solid red" : "1px solid #ccc",
                      }}
                      className={styles.input2}
                      type="number"
                      placeholder="מקסימום"
                      min={1}
                      onChange={(e) => setMaxSize(e.target.value)}
                    />
                  </div>
                  <p className={styles.error}>
                    {sizeError && (
                      <div className={styles.errorText}>
                        לא ניתן לסנן כאשר המקסימום קטן מהמינימום
                      </div>
                    )}
                  </p>
                </div>
                <div>
                  <label htmlFor="">מאפיינים</label>
                  <div className={styles.divCheckBox}>
                    <div className={styles.column}>
                      <label className={styles.checkboxLabel}>
                        <CustomInput className={styles.checkBox} type="checkbox" />
                        מרפסת
                      </label>
                      <label className={styles.checkboxLabel}>
                        <CustomInput className={styles.checkBox} type="checkbox" />
                        מחסן
                      </label>
                    </div>
                    <div className={styles.column}>
                      <label className={styles.checkboxLabel}>
                        <CustomInput className={styles.checkBox} type="checkbox" />
                        חניה
                      </label>
                      <label className={styles.checkboxLabel}>
                        <CustomInput className={styles.checkBox} type="checkbox" />
                        מעלית
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="">סטטוס</label>
                  <div className={styles.divRadio}>
                    <label className={styles.checkboxLabel}>
                      <CustomInput value="" name="type" type="radio" onChange={(e) => setType(e.target.value)} />
                      הכל
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput value="להשכרה" name="type" type="radio" onChange={(e) => setType(e.target.value)} />
                      להשכרה
                    </label>
                    <label className={styles.checkboxLabel}>
                      <CustomInput value="למכירה" name="type" type="radio" onChange={(e) => setType(e.target.value)} />
                      למכירה
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.btnSearchPropertyDiv}>
              <button onClick={filterProp} className={styles.btnSearchProperty}>
                🔍 חפש נכסים{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.SearchProperty}>
        <div className={styles.headerProperty}>
          <h2>נמצאו {filteredProperties.length} נכסים</h2>
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
              value = {sort}
              onChange={(value) => setSort(value)}
            />
          </div>
        </div>
        <div className={styles.containerProperties}>
          <Property properties={currentProperties} />
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
