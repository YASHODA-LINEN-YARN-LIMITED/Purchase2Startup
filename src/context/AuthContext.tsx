import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canPerform: (department: string, action?: string) => boolean;
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'u-admin',
    email: 'admin@p2s-management.com',
    fullName: 'R. K. Singhania (MD / Super Admin)',
    role: 'SUPER_ADMIN',
    department: 'Management',
    phone: '+91 98200 11223',
    isActive: true,
  },
  {
    id: 'u-mgmt',
    email: 'director@p2s-management.com',
    fullName: 'S. N. Murthy (Director Ops)',
    role: 'MANAGEMENT',
    department: 'Management',
    phone: '+91 98200 44551',
    isActive: true,
  },
  {
    id: 'u-sales',
    email: 'vikram.sales@p2s-management.com',
    fullName: 'Vikram Malhotra (Sales Head)',
    role: 'SALES',
    department: 'Sales',
    phone: '+91 98201 22334',
    isActive: true,
  },
  {
    id: 'u-comm',
    email: 'anita.comm@p2s-management.com',
    fullName: 'Anita Desai (Commercial Lead)',
    role: 'COMMERCIAL',
    department: 'Commercial',
    phone: '+91 98202 33445',
    isActive: true,
  },
  {
    id: 'u-tech',
    email: 'arvind.tech@p2s-management.com',
    fullName: 'Dr. Arvind Joshi (Chief Technical Officer)',
    role: 'TECHNICAL',
    department: 'Technical',
    phone: '+91 98203 44556',
    isActive: true,
  },
  {
    id: 'u-prod',
    email: 'sunil.prod@p2s-management.com',
    fullName: 'Sunil Pawar (Production Manager)',
    role: 'PRODUCTION',
    department: 'Production',
    phone: '+91 98204 55667',
    isActive: true,
  },
  {
    id: 'u-qc',
    email: 'pradeep.qc@p2s-management.com',
    fullName: 'Pradeep Nair (Quality Head)',
    role: 'QUALITY',
    department: 'Quality',
    phone: '+91 98205 77881',
    isActive: true,
  },
  {
    id: 'u-proj',
    email: 'rajesh.site@p2s-management.com',
    fullName: 'Rajesh Kulkarni (Site Project Manager)',
    role: 'PROJECT',
    department: 'Project',
    phone: '+91 98205 66778',
    isActive: true,
  },
  {
    id: 'u-service',
    email: 'deepak.srv@p2s-management.com',
    fullName: 'Deepak Verma (Service Lead)',
    role: 'SERVICE',
    department: 'Service',
    phone: '+91 98206 77889',
    isActive: true,
  },
  {
    id: 'u-viewer',
    email: 'guest.viewer@p2s-management.com',
    fullName: 'Guest Observer (Read Only)',
    role: 'VIEWER',
    department: 'Management',
    phone: '+91 98209 00000',
    isActive: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableUsers] = useState<UserProfile[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('p2s_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_USERS[0]; // Super Admin by default
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('p2s_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (userId: string) => {
    const found = availableUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const switchRole = (role: UserRole) => {
    const matched = availableUsers.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        role,
      }));
    }
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    const matched = availableUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      return true;
    }
    // Generic login
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      email,
      fullName: email.split('@')[0].toUpperCase(),
      role: 'ADMIN',
      department: 'Management',
      isActive: true,
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // RBAC permission check
  const canPerform = (department: string, _action?: string): boolean => {
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' || currentUser.role === 'MANAGEMENT') {
      return true;
    }
    if (currentUser.role === 'VIEWER') {
      return false;
    }
    // Allow matching department or specific cross-functional leads
    return (
      currentUser.department.toLowerCase().includes(department.toLowerCase()) ||
      currentUser.role.toLowerCase().includes(department.toLowerCase()) ||
      currentUser.role === 'PROJECT'
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableUsers,
        switchUser,
        switchRole,
        login,
        logout,
        isAuthenticated,
        canPerform,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
