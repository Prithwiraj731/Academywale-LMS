import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin from '../../../client/src/pages/Admin'
import AdminDashboard from '../../../client/src/pages/AdminDashboard'
import './index.css'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
