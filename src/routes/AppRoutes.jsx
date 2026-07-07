import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import EmployerRoute from "./EmployerRoute";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";

import Home from "../pages/public/Home";
import NotFound from "../pages/public/NotFound";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Privacy from "../pages/public/Privacy";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Jobs from "../pages/jobs/Jobs";
import JobDetails from "../pages/jobs/JobDetails";
import MyApplications from "../pages/applications/MyApplications";
import Profile from "../pages/profile/Profile";

import DashboardLayout from "../pages/employer/DashboardLayout";
import DashboardHome from "../pages/employer/DashboardHome";
import MyJobs from "../pages/employer/MyJobs";
import PostJob from "../pages/employer/PostJob";
import EditJob from "../pages/employer/EditJob";
import Applicants from "../pages/employer/Applicants";

import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminUserDetails from "../pages/admin/AdminUserDetails";
import AdminJobs from "../pages/admin/AdminJobs";
import AdminJobDetails from "../pages/admin/AdminJobDetails";
import AdminProfile from "../pages/admin/AdminProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Auth pages — only for guests */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Authenticated (job seeker) pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Employer dashboard (own layout, no navbar/footer) */}
      <Route element={<EmployerRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="jobs/new" element={<PostJob />} />
          <Route path="jobs/:id/edit" element={<EditJob />} />
          <Route path="jobs/:id/applicants" element={<Applicants />} />
        </Route>
      </Route>

      {/* Admin dashboard (own layout, no navbar/footer) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="jobs/:id" element={<AdminJobDetails />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
