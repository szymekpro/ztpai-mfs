import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx"
import RegisterPage from "./pages/RegisterPage.tsx"
import HomePage from "./pages/HomePage.tsx"
import MembershipPage from "./pages/MembershipPage.tsx"
import GymsPage from "./pages/GymsPage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PaymentsPage from "./pages/PaymentsPage.tsx";
import MainAppLayout from "./components/layouts/MainAppLayout.tsx";
import GuestPage from "./pages/GuestPage.tsx"
import GuestAppLayout from "./components/layouts/GuestAppLayout.tsx";

function Logout () {
  localStorage.clear();
  return <Navigate to="/" />
}

function RegisterAndLogout () {
    localStorage.clear();
    return <RegisterPage />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route element={<GuestAppLayout />}>
            <Route path="/" element={<GuestPage />} />
       </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />

        <Route element={<MainAppLayout />}>
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/memberships" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
            <Route path="/gyms" element={<ProtectedRoute><GymsPage /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App