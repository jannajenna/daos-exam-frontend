// src/context/UserContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the structure of your user object
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

// Define the context value type
type UserContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

// Create the context with default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Export hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Define the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // State: store the user and token
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Method: clear user and token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Wrap everything in a Provider
  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};
