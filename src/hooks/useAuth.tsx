import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { yunYAuth } from '@/services/yunYAuth';

interface User {
  id: string;
  user_id?: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (nome: string, cpf: string, email: string, telefone: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (identifier: string) => Promise<void>;
  resetPassword: (token: string, novaSenha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um usuário logado ao inicializar
    const currentUser = yunYAuth.getUser();
    if (currentUser) {
      // Mapear user_id para id se necessário
      const mappedUser: User = {
        ...currentUser,
        id: currentUser.user_id,
      };
      setUser(mappedUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (identifier: string, password: string) => {
    const response = await yunYAuth.login({ identifier, senha: password });
    // Mapear user_id para id
    const mappedUser = {
      ...response.data.user,
      id: response.data.user.user_id,
    };
    setUser(mappedUser);
    navigate('/dashboard');
  };

  const signUp = async (nome: string, cpf: string, email: string, telefone: string, senha: string) => {
    await yunYAuth.register({ nome, cpf, email, telefone, senha });
    // Após o registro bem-sucedido, redirecionar para login
    navigate('/auth');
  };

  const signOut = async () => {
    yunYAuth.logout();
    setUser(null);
    navigate('/');
  };

  const forgotPassword = async (identifier: string) => {
    await yunYAuth.forgotPassword({ identifier });
  };

  const resetPassword = async (token: string, novaSenha: string) => {
    await yunYAuth.resetPassword({ token, novaSenha });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      forgotPassword, 
      resetPassword 
    }}>
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
