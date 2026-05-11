import { useState, useEffect } from 'react';
import { User } from '../types';
import { isApiEnabled } from '../services/api';
import { authService } from '../services/auth';
import { mapUserFromApi, type ApiUser } from '../services/mappers';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@sistema.com',
    role: 'ADMIN',
    isActive: true,
    participateInRoleta: false
  },
  {
    id: '2',
    name: 'Imobiliária Central',
    email: 'contato@imobiliariacentral.com',
    role: 'IMOBILIARIA',
    whatsapp: '11999999999',
    segmento: 'Residencial',
    isActive: true,
    participateInRoleta: false
  },
  {
    id: '3',
    name: 'João Silva',
    email: 'joao@corretor.com',
    role: 'CORRETOR',
    whatsapp: '11888888888',
    isActive: true,
    participateInRoleta: true
  }
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: User['role']): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
  const { token, user } = await authService.login(email, password);
  // se backend não retornar role, mantém selecionada
  const userWithRole: ApiUser = { ...(user as ApiUser), role: (user as ApiUser).role || role };
  const mappedUser: User = mapUserFromApi(userWithRole);
        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        localStorage.setItem('token', token);
        return true;
      }
      // Fallback mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      const credentials = {
        ADMIN: { email: 'admin@sistema.com', password: 'admin123' },
        IMOBILIARIA: { email: 'imobiliaria@teste.com', password: 'imob123' },
        CORRETOR: { email: 'corretor@teste.com', password: 'corr123' }
      } as const;
      const validCredential = credentials[role];
      if (email === validCredential.email && password === validCredential.password) {
        const userData = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', `mock-jwt-token-${role.toLowerCase()}`);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const hasPermission = (requiredRole: User['role'][]): boolean => {
    if (!user) return false;
    return requiredRole.includes(user.role);
  };

  return {
    user,
    login,
    logout,
    isLoading,
    hasPermission,
    isAuthenticated: !!user
  };
};