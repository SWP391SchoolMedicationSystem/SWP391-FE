import './styles/main.scss';
import { Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

// Layouts
import ManagerLayout from './components/layout/ManagerLayout';
import AdminLayout from './components/layout/AdminLayout';
import NurseLayout from './components/layout/NurseLayout';
import ParentLayout from './components/layout/ParentLayout';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute';

// Manager pages
import Dashboard from './pages/Manager/Dashboard';
import AccountManagement from './pages/Manager/AccountManagement';
import BlogManagement from './pages/Manager/BlogManagement';
import ManagerVaccinationEvents from './pages/Manager/VaccinationEvents';
import VaccinationEventStudents from './pages/Manager/VaccinationEventStudents';
import VaccinationEventParents from './pages/Manager/VaccinationEventParents';
import ManagerNotifications from './pages/Manager/Notifications';
import StudentList from './pages/Manager/StudentList';
import ManagerStudentHealthRecordDetail from './pages/Manager/StudentHealthRecordDetail';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import ManageManagers from './pages/Admin/ManageManagers';
import SystemLogs from './pages/Admin/SystemLogs';
import FormCategories from './pages/Admin/FormCategories';
import EmailTemplates from './pages/Admin/EmailTemplates';
import AdminSettings from './pages/Admin/Settings';

// Nurse pages
import NurseVaccinationEvents from './pages/Nurse/VaccinationEvents';
import NurseVaccinationEventStudents from './pages/Nurse/VaccinationEventStudents';
import MedicationSchedule from './pages/Nurse/MedicationSchedule';
import HandleMedicine from './pages/Nurse/HandleMedicine';
import MedicineManagement from './pages/Nurse/MedicineManagement';
import NurseStudentList from './pages/Nurse/StudentList';
import NurseBlog from './pages/Nurse/Blog';
import ChatWithParents from './pages/Nurse/ChatWithParents';
import NurseStudentHealthRecordDetail from './pages/Nurse/StudentHealthRecordDetail';
import NurseNotifications from './pages/Nurse/Notifications';
import NursePersonalMedicine from './pages/Nurse/PersonalMedicine';
import ReviewRequests from './pages/Nurse/ReviewRequests';

// Parent pages
import ParentDashboard from './pages/Parent/Dashboard';
import ViewBlog from './pages/Parent/ViewBlog';
import ParentVaccinationEvents from './pages/Parent/VaccinationEvents';
import HealthHistory from './pages/Parent/HealthHistory';
import ParentNotifications from './pages/Parent/Notifications';
import Consultation from './pages/Parent/Consultation';
import ChatWithNurse from './pages/Parent/ChatWithNurse';
import ManageHealthRecords from './pages/Parent/ManageHealthRecords';
import ParentStudentHealthRecordDetail from './pages/Parent/StudentHealthRecordDetail';
import UpdateProfile from './pages/Parent/UpdateProfile';
import MedicineRequest from './pages/Parent/MedicineRequest';


function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-managers" element={<ManageManagers />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="form-categories" element={<FormCategories />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Manager routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['Manager']}>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<AccountManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route
            path="vaccination-events"
            element={<ManagerVaccinationEvents />}
          />
          <Route
            path="vaccination-events/:eventId/students"
            element={<VaccinationEventStudents />}
          />
          <Route
            path="vaccination-event-parents/:eventId"
            element={<VaccinationEventParents />}
          />
          <Route path="StudentList" element={<StudentList />} />
          <Route
            path="student-health-record/:studentId"
            element={<ManagerStudentHealthRecordDetail />}
          />
          <Route path="notifications" element={<ManagerNotifications />} />
        </Route>

        {/* Nurse routes */}
        <Route
          path="/nurse"
          element={
            <ProtectedRoute allowedRoles={['Nurse']}>
              <NurseLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<NurseVaccinationEvents />} />
          <Route
            path="vaccination-events"
            element={<NurseVaccinationEvents />}
          />
          <Route
            path="vaccination-events/:eventId/students"
            element={<NurseVaccinationEventStudents />}
          />
          <Route path="medication-schedule" element={<MedicationSchedule />} />
          <Route path="handle-medicine" element={<HandleMedicine />} />
          <Route path="medicine-management" element={<MedicineManagement />} />
          <Route
            path="personal-medicine"
            element={<NursePersonalMedicine />}
          />
          <Route path="student-list" element={<NurseStudentList />} />
          <Route path="blog" element={<NurseBlog />} />
          <Route path="chat" element={<ChatWithParents />} />
          <Route
            path="student-health-record/:studentId"
            element={<NurseStudentHealthRecordDetail />}
          />
          <Route path="notifications" element={<NurseNotifications />} />
          <Route path="review-requests" element={<ReviewRequests />} />
        </Route>

        {/* Parent routes */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={['Parent']}>
              <ParentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ParentDashboard />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="view-blog" element={<ViewBlog />} />
          <Route
            path="vaccination-events"
            element={<ParentVaccinationEvents />}
          />
          <Route path="health-history" element={<HealthHistory />} />
          <Route path="notifications" element={<ParentNotifications />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="chat-nurse" element={<ChatWithNurse />} />
          <Route path="medicine-request" element={<MedicineRequest />} />
          <Route path="health-records" element={<ManageHealthRecords />} />
          <Route
            path="health-records/:studentId"
            element={<ParentStudentHealthRecordDetail />}
          />
          <Route
            path="manage-health-records"
            element={<ManageHealthRecords />}
          />
          <Route path="update-profile" element={<UpdateProfile />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
