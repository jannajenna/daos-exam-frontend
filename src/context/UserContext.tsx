// src/context/UserContext.tsx

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// 🧾 Define the shape of a User object coming from the backend
type User = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileText?: string;
  profilePhoto?: string;
  instrument?: string;
  ensembles?: string[];
};

// 📦 Define the shape of the context value that will be shared
type UserContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

// 🚀 Create the actual context (initially undefined until wrapped in provider)
const UserContext = createContext<UserContextType | undefined>(undefined);

// 🔁 Custom hook to access user context anywhere in the app
// Ensures it's only used inside a <UserProvider>
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// 🧩 The Provider component that wraps your app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // 🧠 State: store the current user object
  const [user, setUser] = useState<User | null>(null);

  // 🔐 State: store the JWT token (try to load from localStorage on init)
  const [token, setTokenState] = useState<string | null>(null);

  // ✅ Custom setter that also writes to localStorage
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  // 🧠 On mount, restore token from localStorage if it exists
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 🚪 Logout: clear user + token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // ✅ Provide the context value to children
  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

