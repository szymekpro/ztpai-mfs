import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx"
import RegisterPage from "./pages/RegisterPage.tsx"
import HomePage from "./pages/HomePage.tsx"
import MembershipPage from "./pages/MembershipPage.tsx"
import GymsPage from "./pages/GymsPage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PaymentsPage from "./pages/PaymentsPage.tsx";

function Logout () {
  localStorage.clear();
  return <Navigate to="/login" />
}

function RegisterAndLogout () {
    localStorage.clear();
    return <RegisterPage />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/memberships" element={<MembershipPage />} />
        <Route path="/gyms" element={<GymsPage />} />
        <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App