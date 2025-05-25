import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  // Add other user-specific fields as needed from your backend's user object
  // e.g., business_name, logo_url from profiles table could be added here
  // For now, keeping it minimal to what Supabase auth.user returns directly
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  // setUser will be used internally for profile updates
  setUser: (user: User | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check localStorage

  useEffect(() => {
    // Check localStorage for existing session on initial load
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('sessionToken');
      const storedUserData = localStorage.getItem('userData');
      if (storedToken && storedUserData) {
        setToken(storedToken);
        setUser(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
      // Clear potentially corrupted storage
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('userData');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, authToken: string) => {
    setIsLoading(true);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('sessionToken', authToken);
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('sessionToken');
    // Potentially call backend logout if needed to invalidate session server-side:
    // fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
    setIsLoading(false);
    // Navigation to login page will be handled by consuming components or router
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
