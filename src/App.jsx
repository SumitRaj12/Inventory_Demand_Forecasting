import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout"; 
import Dashboard from "./pages/Dashboard";
import { Toaster } from 'react-hot-toast';
import Product from "./pages/Products.jsx";
import Sales from "./pages/Sales.jsx";
import Employee from "./pages/Employee.jsx";
import ChangePassword from "./components/changePassword.jsx";
import { SalesContextProvider } from "./context/salesUpdate.context";

import Forecasting from "./pages/forecast";
import Prediction from "./pages/Prediction";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="product" element={<Product/>} />
          <Route path="sales" element={<Sales/>} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="employee" element={<Employee/>} />
          <Route path="forecasting" element={<Forecasting/>} />
          <Route path="change-password" element={<ChangePassword />} />

        </Route>
        
      </Routes>

      
      <Toaster 
        position="top-right"
        reverseOrder={false}
      />
    </Router>
  );
}

export default App;
