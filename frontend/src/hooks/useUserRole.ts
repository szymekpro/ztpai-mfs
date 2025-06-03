import { useMemo } from "react";
import {ACCESS_TOKEN} from "../api/const.ts";

type UserRole = "admin" | "employee" | "member" | "anonymous";

export function useUserRole(): {
  role: UserRole;
  isAdmin: boolean;
  isEmployee: boolean;
  isMember: boolean;
  isAuthenticated: boolean;
} {
  return useMemo(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      return {
        role: "anonymous",
        isAdmin: false,
        isEmployee: false,
        isMember: false,
        isAuthenticated: false,
      };
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = (payload.role || "member") as UserRole;

      return {
        role,
        isAdmin: role === "admin",
        isEmployee: role === "employee",
        isMember: role === "member",
        isAuthenticated: true,
      };
    } catch {
      return {
        role: "anonymous",
        isAdmin: false,
        isEmployee: false,
        isMember: false,
        isAuthenticated: false,
      };
    }
  }, []);
}
