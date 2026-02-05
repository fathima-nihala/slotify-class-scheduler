import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './pages/ProtectedRoute'
import MonthlySchedule from './components/MonthlySchedule'

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MonthlySchedule />} />
        {/* <Route path="/schedule/overview" element={<SelectedSlots />} /> */}
      </Route>
    </Routes>
  )
}

export default App
