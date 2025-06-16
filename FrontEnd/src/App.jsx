// import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManagerLayout from "./components/layout/ManagerLayout";
import Dashboard from "./pages/Manager/Dashboard";
import AccountManagement from "./pages/Manager/AccountManagement";
import BlogManagement from "./pages/Manager/BlogManagement";
import VaccinationList from "./pages/Manager/VaccinationList";
import Notifications from "./pages/Manager/Notifications";
import CategoryForms from "./pages/Manager/CategoryForms";
import ViewInformation from "./pages/Manager/ViewInformation";
import Settings from "./pages/Manager/Settings";
import StudentList from "./pages/Manager/StudentList";

// Nurse imports
import NurseLayout from "./components/layout/NurseLayout";
import NurseVaccinationList from "./pages/Nurse/VaccinationList";
import MedicationSchedule from "./pages/Nurse/MedicationSchedule";
import HandleMedicine from "./pages/Nurse/HandleMedicine";
import NurseStudentList from "./pages/Nurse/StudentList";
import NurseBlog from "./pages/Nurse/Blog";
import ChatWithParents from "./pages/Nurse/ChatWithParents";
import StudentHealthRecord from "./pages/Nurse/StudentHealthRecord";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />

        {/* Manager routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<AccountManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="vaccinations" element={<VaccinationList />} />
          <Route path="StudentList" element={<StudentList />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="forms" element={<CategoryForms />} />
          <Route path="info" element={<ViewInformation />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Nurse routes */}
        <Route path="/nurse" element={<NurseLayout />}>
          <Route index element={<NurseVaccinationList />} />
          <Route path="medication-schedule" element={<MedicationSchedule />} />
          <Route path="handle-medicine" element={<HandleMedicine />} />
          <Route path="student-list" element={<NurseStudentList />} />
          <Route path="blog" element={<NurseBlog />} />
          <Route path="chat" element={<ChatWithParents />} />
          <Route path="health-records" element={<StudentHealthRecord />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
