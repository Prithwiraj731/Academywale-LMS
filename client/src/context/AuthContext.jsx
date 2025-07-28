import React, { createContext, useContext } from 'react';
import { useUser, useSession } from '@clerk/clerk-react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { session } = useSession();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token: session?.idToken, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
