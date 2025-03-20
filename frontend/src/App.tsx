import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import Home from "./pages/Home.tsx"
import NotFound from "./pages/NotFound.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

function Logout () {
  localStorage.clear();
  return <Navigate to="/login" />
}

function RegisterAndLogout () {
    localStorage.clear();
    return <Register />
}
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App