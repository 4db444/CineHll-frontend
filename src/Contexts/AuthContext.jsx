import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

// Decode JWT payload without a library
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount, restore user from token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const decoded = decodeToken(storedToken);
      // Check if token is expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const { token: newToken } = res.data;
    localStorage.setItem('token', newToken);

    // Decode user from JWT
    const decoded = decodeToken(newToken);
    const userData = {
      id: decoded.sub,
      first_name: decoded.first_name || '',
      last_name: decoded.last_name || '',
      email: decoded.email || email,
      is_admin: decoded.is_admin || false,
    };

    // If JWT doesn't contain user info, we store minimal info
    // The backend login only returns token, so we decode what we can
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('token', newToken);

    const userData = {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      is_admin: newUser.is_admin || false,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const res = await authService.updateProfile(data);
    // Update local user data
    const updatedUser = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return res.data;
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.is_admin === true || user?.is_admin === 1,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
