import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'manager' | 'staff';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isManager: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const permissions = {
  admin: ['manage_tables', 'manage_zones', 'view_statistics', 'edit_statistics', 'manage_users'],
  manager: ['manage_tables', 'manage_zones', 'view_statistics', 'edit_statistics'],
  staff: ['view_statistics']
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@restaurant.com'
  });

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return permissions[user.role]?.includes(permission) || false;
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      hasPermission,
      isAdmin,
      isManager
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
