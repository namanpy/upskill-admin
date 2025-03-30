import { createContext, useContext, useState, ReactNode } from "react";

// Create the Auth Context
interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get initial auth state from localStorage
  const storedToken = localStorage.getItem("token");
  const isTokenValid = storedToken ? !isTokenExpired(storedToken) : false;
  const validToken = isTokenValid ? storedToken : null;

  // Helper function to check if token is expired
  function isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp * 1000 < Date.now() : true;
    } catch {
      return true;
    }
  }

  const [user, setUser] = useState<string | null>(validToken); // null means not authenticated

  // Function to log in a user
  const login = (token: string): void => {
    setUser(token); // Set user data
    localStorage.setItem("token", token); // Persist state
  };

  // Function to log out a user
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
