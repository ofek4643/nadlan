import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import SearchProperty from "./Pages/SearchProperty/SearchProperty.jsx";
import Layout from "./components/Layout/Layout.jsx";
import MortgageCalculator from "./Pages/Mortgage-calculator/MortgageCalculator.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import Terms from "./Pages/Terms/Terms.jsx";
import Privacy from "./Pages/Privacy/Privacy.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<SearchProperty />} />
          <Route path="mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
