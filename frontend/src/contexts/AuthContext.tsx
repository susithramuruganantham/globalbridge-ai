import React, { createContext, useContext, useState } from 'react';
import { Role, User } from '../types';

interface AuthContextType {
  user: User;
  role: Role;
  switchRole: (newRole: Role) => void;
}

const DEFAULT_USERS: Record<Role, User> = {
  ADMIN: {
    id: 1,
    username: 'admin',
    email: 'admin@globalbridge.ai',
    role: 'ADMIN',
    full_name: 'Platform Administrator',
    company: 'GlobalBridge International HQ',
    phone: '+91 98765 00001'
  },
  MSME_OWNER: {
    id: 2,
    username: 'owner',
    email: 'owner@globalbridge.ai',
    role: 'MSME_OWNER',
    full_name: 'Senthil Kumar',
    company: 'Tamil Nadu & Deccan Craft Consortium',
    phone: '+91 98765 43210'
  },
  ARTISAN: {
    id: 3,
    username: 'artisan',
    email: 'artisan@globalbridge.ai',
    role: 'ARTISAN',
    full_name: 'K. Sundaramoorthy',
    company: 'Kanchipuram Silk Guild',
    phone: '+91 94432 11001'
  },
  BUYER: {
    id: 4,
    username: 'buyer',
    email: 'buyer@globalbridge.ai',
    role: 'BUYER',
    full_name: 'Jonathan Tan',
    company: 'Singapore Wholesale Imports Pte Ltd',
    phone: '+65 6789 0123'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('gb_active_role') as Role) || 'MSME_OWNER';
  });

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('gb_active_role', newRole);
  };

  const user = DEFAULT_USERS[role] || DEFAULT_USERS.MSME_OWNER;

  return (
    <AuthContext.Provider value={{ user, role, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
