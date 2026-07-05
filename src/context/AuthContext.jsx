import { createContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser } from "../services/authApi";
import { getProfile } from "../services/userApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Restore auth automatically on refresh (state is already lazily
  // initialized from localStorage above; this keeps things in sync
  // if localStorage changes in another tab).
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      const stored = localStorage.getItem("user");
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Whenever we have a token (on first load, after login, after a refresh),
  // pull the full profile from the backend rather than trusting only what
  // was cached in localStorage — this is what keeps profilePhoto/resume
  // showing up correctly even if a past login response was missing them.
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    (async () => {
      try {
        const data = await getProfile();
        if (mounted && data?.user) {
          setUser((prev) => {
            const next = { ...prev, ...data.user };
            localStorage.setItem("user", JSON.stringify(next));
            return next;
          });
        }
      } catch {
        // Token might be invalid/expired — the axios 401 interceptor
        // already handles clearing the session in that case.
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    setIsLoading(true);
    try {
      const data = await registerUser({ name, email, password, role });
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // Merge partial updates (e.g. { profilePhoto } or { resume }) into the
  // stored user object, keeping localStorage and state in sync.
  const updateUser = useCallback((partialUser) => {
    setUser((prev) => {
      const next = { ...prev, ...partialUser };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    token,
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
