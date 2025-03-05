import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../api/const";
import { useState, useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        auth().catch(() => setIsAuthenticated(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        const decoded: { exp?: number } = jwtDecode(token); // Określamy typ dla `decoded`
        const tokenExpiration = decoded.exp; // `exp` może być `undefined`

        if (!tokenExpiration) {
            setIsAuthenticated(false);
            return;
        }

        const currentTime = Date.now() / 1000;
        if (tokenExpiration < currentTime) {
            await refreshToken();
        } else {
            setIsAuthenticated(true);
        }
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
