import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import BranchesPage from "./pages/BranchesPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import TrackingPage from "./pages/TrackingPage";
import HomeRelocationPage from "./pages/HomeRelocationPage";
import OfficeRelocationPage from "./pages/OfficeRelocationPage";
import FineArtLogisticsPage from "./pages/FineArtLogisticsPage";
import CarRelocationPage from "./pages/CarRelocationPage";
import WarehouseFacilityPage from "./pages/WarehouseFacilityPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminFleetManagementPage from "./pages/AdminFleetManagementPage";
import AdminBookingManagementPage from "./pages/AdminBookingManagementPage";
import DriverLoginPage from "./pages/DriverLoginPage";
import DriverDashboardPage from "./pages/DriverDashboardPage";
import EnhancedDriverDashboardPage from "./pages/EnhancedDriverDashboardPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import EnhancedLiveTrackingPage from "./pages/EnhancedLiveTrackingPage";
import PaymentPage from "./pages/PaymentPage";
import ReviewsPage from "./pages/ReviewsPage";
import NotFoundPage from "./pages/NotFoundPage";
import BookingPage from "./pages/BookingPage"; 

// Protected route wrappers
const ProtectedAdminDashboard = () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboardPage />
  </ProtectedRoute>
);

const ProtectedAdminFleet = () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminFleetManagementPage />
  </ProtectedRoute>
);

const ProtectedAdminBooking = () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminBookingManagementPage />
  </ProtectedRoute>
);

const ProtectedDriverDashboard = () => (
  <ProtectedRoute allowedRoles={['driver']}>
    <EnhancedDriverDashboardPage />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "services", Component: ServicesPage },
      { path: "branches", Component: BranchesPage },
      { path: "gallery", Component: GalleryPage },
      { path: "tracking", Component: TrackingPage },
      { path: "contact", Component: ContactPage },
      { path: "reviews", Component: ReviewsPage },
      { path: "services/home-relocation", Component: HomeRelocationPage },
      { path: "services/office-relocation", Component: OfficeRelocationPage },
      { path: "services/fine-art-logistics", Component: FineArtLogisticsPage },
      { path: "services/car-relocation", Component: CarRelocationPage },
      { path: "services/warehouse-facility", Component: WarehouseFacilityPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLoginPage,
  },
  {
    path: "/admin/dashboard",
    Component: ProtectedAdminDashboard,
  },
  {
    path: "/admin/fleet-management",
    Component: ProtectedAdminFleet,
  },
  {
    path: "/admin/booking-management",
    Component: ProtectedAdminBooking,
  },
  {
    path: "/driver/login",
    Component: DriverLoginPage,
  },
  {
    path: "/driver/dashboard",
    Component: ProtectedDriverDashboard,
  },
  {
    path: "/live-tracking",
    Component: LiveTrackingPage,
  },
  {
    path: "/enhanced-tracking",
    Component: EnhancedLiveTrackingPage,
  },
  {
    path: "/payment",
    Component: PaymentPage,
  },
  {
    // ← NEW: Public booking page — accessed via quote token link
    // e.g. https://yoursite.com/booking?token=QT-1234567-ABCDEF
    path: "/booking",
    Component: BookingPage,
  },
]);