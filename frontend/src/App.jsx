import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import HeroSection from './pages/Dashboard/HeroSection'
import Navbar from './pages/Dashboard/Navbar'
import NotificationSidebar from './pages/Dashboard/NotificationSidebar'
import Sidebar from './pages/Dashboard/Sidebar'
import AdminLogin from './pages/Login/AdminLogin'
import ChangePassword from './pages/Login/ChangePassword'
import ForgetPassword from './pages/Login/ForgetPassword'
import ForgetPasswordUpdate from './pages/Login/ForgetPasswordUpdate'
import UserLogin from './pages/Login/UserLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AdminLogin />
      <UserLogin />
      <ChangePassword />
      <ForgetPassword />
      <ForgetPasswordUpdate />
      <Navbar />
      <Sidebar />
      <NotificationSidebar />
      <HeroSection />
      
    </>
  )
}

export default App
