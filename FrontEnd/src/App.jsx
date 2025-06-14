// import React, { useState } from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import MedlearnLoginPage from "./pages/Login"; // Đảm bảo đúng đường dẫn
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AccountManagement from "./pages/Admin/AccountManagement";
import BlogManagement from "./pages/Admin/BlogManagement";
import VaccinationList from "./pages/Admin/VaccinationList";
import MonitoringReporting from "./pages/Admin/MonitoringReporting";
import Notifications from "./pages/Admin/Notifications";
import CategoryForms from "./pages/Admin/CategoryForms";
import ViewInformation from "./pages/Admin/ViewInformation";
import Settings from "./pages/Admin/Settings";

import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MedlearnLoginPage />} />
        <Route path="/home" element={<Home />} />

        <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="accounts" element={<AccountManagement />} />
    <Route path="blogs" element={<BlogManagement />} />
    <Route path="vaccinations" element={<VaccinationList />} />
    <Route path="reports" element={<MonitoringReporting />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="forms" element={<CategoryForms />} />
    <Route path="info" element={<ViewInformation />} />
    <Route path="settings" element={<Settings />} />
  </Route>

      </Routes>
    </>
  );
}

export default App;
