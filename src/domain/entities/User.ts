export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  cpf?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  cpf?: string;
  created_at: string;
  updated_at: string;
}
