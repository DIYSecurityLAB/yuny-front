// Serviço de autenticação para a API YunY
import { toast } from '@/hooks/use-toast';

// Configurações da API
const API_BASE_URL = import.meta.env.VITE_YUNY_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_YUNY_API_KEY || 'sua-api-key-aqui';

// Interfaces baseadas na documentação da API
interface RegisterRequest {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
}

interface LoginRequest {
  identifier: string; // CPF ou email
  senha: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface ForgotPasswordRequest {
  identifier: string; // CPF, email ou telefone
}

interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}

interface User {
  user_id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  data_criacao?: string;
  ultimo_login?: string;
}

interface AuthResponse {
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}

interface RegisterResponse {
  message: string;
  user: User;
}

// Headers padrão para todas as requisições
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
});

// Função auxiliar para fazer requisições HTTP
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
};

// Classe principal do serviço de autenticação
export class YunYAuthService {
  private static instance: YunYAuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  private constructor() {
    // Recuperar tokens do localStorage
    this.accessToken = localStorage.getItem('yuny_access_token');
    this.refreshToken = localStorage.getItem('yuny_refresh_token');
    const userData = localStorage.getItem('yuny_user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch {
        localStorage.removeItem('yuny_user');
      }
    }
  }

  public static getInstance(): YunYAuthService {
    if (!YunYAuthService.instance) {
      YunYAuthService.instance = new YunYAuthService();
    }
    return YunYAuthService.instance;
  }

  // Armazenar tokens no localStorage
  private storeTokens(response: AuthResponse) {
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    const user = response.data.user;

    if (!accessToken || !refreshToken || !user) {
      console.error('Resposta da API inválida:', response);
      throw new Error('Tokens ou dados do usuário não encontrados na resposta');
    }

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;

    localStorage.setItem('yuny_access_token', accessToken);
    localStorage.setItem('yuny_refresh_token', refreshToken);
    localStorage.setItem('yuny_user', JSON.stringify(user));
    
    console.log('✅ Tokens salvos com sucesso no localStorage');
  }

  // Limpar tokens do localStorage
  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;

    localStorage.removeItem('yuny_access_token');
    localStorage.removeItem('yuny_refresh_token');
    localStorage.removeItem('yuny_user');
  }

  // Registro de usuário
  public async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast({
        title: 'Registro realizado com sucesso!',
        description: response.message,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no registro';
      toast({
        title: 'Erro no registro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }

  // Login do usuário
  public async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      this.storeTokens(response);

      toast({
        title: 'Login realizado com sucesso!',
        description: response.message,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no login';
      toast({
        title: 'Erro no login',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }

  // Renovar token
  public async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    try {
      const response = await apiRequest<{ data: { access_token: string; refresh_token: string } }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      localStorage.setItem('yuny_access_token', response.data.access_token);
      localStorage.setItem('yuny_refresh_token', response.data.refresh_token);
      
      console.log('✅ Token renovado com sucesso');
    } catch (error) {
      // Se falhar ao renovar, fazer logout
      this.logout();
      throw error;
    }
  }

  // Esqueci minha senha
  public async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      const response = await apiRequest<{ message: string }>('/auth/esqueceu-senha', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast({
        title: 'Token enviado!',
        description: response.message,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao solicitar recuperação';
      toast({
        title: 'Erro ao solicitar recuperação',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }

  // Redefinir senha
  public async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      const response = await apiRequest<{ message: string }>('/auth/redefinir-senha', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast({
        title: 'Senha redefinida!',
        description: response.message,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao redefinir senha';
      toast({
        title: 'Erro ao redefinir senha',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }

  // Logout
  public logout(): void {
    this.clearTokens();
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
  }

  // Getters
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public getUser(): User | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken && !!this.user;
  }

  // Requisições autenticadas
  public async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Token de acesso não disponível');
    }

    try {
      return await apiRequest<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    } catch (error) {
      // Se o token expirou (401), tentar renovar
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('401') && this.refreshToken) {
        await this.refreshAccessToken();
        // Tentar novamente com o novo token
        return await apiRequest<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      }
      throw error;
    }
  }
}

// Exportar instância singleton
export const yunYAuth = YunYAuthService.getInstance();