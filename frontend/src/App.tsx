import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx"
import HomePage from "./pages/HomePage.tsx"
import MembershipPage from "./pages/MembershipPage.tsx"
import GymsPage from "./pages/GymsPage.tsx"
import GymDetails from "./components/gyms/GymDetails.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PaymentsPage from "./pages/PaymentsPage.tsx";
import MainAppLayout from "./components/layouts/MainAppLayout.tsx";
import GuestPage from "./pages/GuestPage.tsx"
import GuestAppLayout from "./components/layouts/GuestAppLayout.tsx";
import WorkoutsPage from "./pages/WorkoutsPage.tsx";
import TrainersPage from "./pages/TrainersPage.tsx";
import RegisterForm from "./components/auth/RegisterForm.tsx";
import MembershipDetails from "./components/memberships/MembershipDetails.tsx";
import MembershipBuyPage from "./pages/MembershipBuyPage.tsx";

function Logout () {
  localStorage.clear();
  return <Navigate to="/" />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route element={<GuestAppLayout />}>
            <Route path="/" element={<GuestPage />} />
       </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/logout" element={<Logout />} />

        <Route element={<MainAppLayout />}>
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/memberships" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
            <Route path="/memberships/:id" element={<ProtectedRoute><MembershipDetails /></ProtectedRoute>} />
            <Route path="/memberships/buy/:id" element={<ProtectedRoute><MembershipBuyPage /></ProtectedRoute>} />
            <Route path="/gyms" element={<ProtectedRoute><GymsPage /></ProtectedRoute>} />
            <Route path="/gyms/:id" element={<ProtectedRoute><GymDetails /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/trainers" element={<ProtectedRoute><TrainersPage /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App