import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import SearchProperty from "./Pages/SearchProperty/SearchProperty.jsx";
import Layout from "./components/Layout/Layout.jsx";
import MortgageCalculator from "./Pages/Mortgage-calculator/MortgageCalculator.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import Terms from "./Pages/Terms/Terms.jsx";
import Privacy from "./Pages/Privacy/Privacy.jsx";
import MyProfile from "./Pages/MyProfile/MyProfile.jsx";
import AddProperty from "./Pages/AddProperty/AddProperty.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import PropertyPage from "./Pages/PropertyPage/PropertyPage.jsx";
import AdminUsers from "./Pages/AdminUsers/AdminUsers.jsx";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.jsx";
import EditUser from "./Pages/EditUser/EditUser.jsx";
import { AuthProvider } from "./data/AuthContext.jsx";


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="properties" element={<SearchProperty />} />
            <Route
              path="mortgage-calculator"
              element={<MortgageCalculator />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="/properties/prop/:id" element={<PropertyPage />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users/:id/edit" element={<EditUser />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
