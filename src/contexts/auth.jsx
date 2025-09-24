import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorLogin, setErrorLogin] = useState(null);

  const login = async (credentials) => {
    try {
      setErrorLogin(null);
      
      if (credentials.email && credentials.password) {
        const userData = {
          id: 1,
          email: credentials.email,
          name: 'Usuario Test'
        };
        setUser(userData);
        return userData;
      } else {
        throw new Error('Email y contraseña son requeridos');
      }
    } catch (error) {
      setErrorLogin(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setErrorLogin(null);
  };

  const value = {
    user,
    login,
    logout,
    errorLogin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};