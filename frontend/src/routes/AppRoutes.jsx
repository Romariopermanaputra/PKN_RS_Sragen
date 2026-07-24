import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import PrivateRoute from '../components/PrivateRoute'

// Public Pages
import Home from '../pages/Home'
import Doctors from '../pages/Doctors'
import Schedule from '../pages/Schedule'
import News from '../pages/News'
import Promotions from '../pages/Promotions'
import Contact from '../pages/Contact'
import Achievements from '../pages/Achievements'
import ServiceDetail from '../pages/ServiceDetail'
import DoctorProfile from '../pages/DoctorProfile'
import Facilities from '../pages/Facilities'

// Admin Pages
import Login from '../pages/Login'
import Dashboard from '../pages/admin/Dashboard'
import DoctorsAdmin from '../pages/admin/DoctorsAdmin'
import FacilitiesAdmin from '../pages/admin/FacilitiesAdmin'
import ScheduleAdmin from '../pages/admin/ScheduleAdmin'
import NewsAdmin from '../pages/admin/NewsAdmin'
import PromotionsAdmin from '../pages/admin/PromotionsAdmin'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="news" element={<News />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="contact" element={<Contact />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="layanan" element={<Facilities />} />
        <Route path="service/:id" element={<ServiceDetail />} />
        <Route path="doctor/:id" element={<DoctorProfile />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="doctors" element={<DoctorsAdmin />} />
        <Route path="schedules" element={<ScheduleAdmin />} />
        <Route path="news" element={<NewsAdmin />} />
        <Route path="facilities" element={<FacilitiesAdmin />} />
        <Route path="promotions" element={<PromotionsAdmin />} />
        {/* Contact and Settings placeholder or will map later */}
      </Route>
    </Routes>
  )
}
