// import { useEffect, useState } from "react";
// import axios from "axios";
// import Property from "../components/Property/Property";

// const PropertiesPage = () => {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProperties() {
//       try {
//         const res = await axios.get("http://localhost:5000/properties");
//         setTimeout(() => {
//           setProperties(res.data);
//           setLoading(false);
//         }, 3500); // סימולציה של עיכוב
//       } catch (err) {
//         console.error("שגיאה בשליפת נכסים:", err);
//       }
//     }

//     fetchProperties();
//   }, []);
  
//   return loading ? (
//     <div style={{ textAlign: "center", fontSize: "1.5rem", marginTop: "2rem" }}>
//       טוען נכסים...
//     </div>
//   ) : (
//     <Property properties={properties} />
//   );
// };

// export default PropertiesPage;
