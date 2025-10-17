-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pontos (points) table
CREATE TABLE IF NOT EXISTS public.pontos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  saldo DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create transacoes (transactions) table
CREATE TABLE IF NOT EXISTS public.transacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('compra', 'venda', 'p2p_envio', 'p2p_recebimento', 'marketplace')),
  valor DECIMAL(15, 2) NOT NULL,
  pontos DECIMAL(15, 2) NOT NULL,
  cotacao DECIMAL(15, 6) NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida', 'cancelada')),
  destinatario_id UUID REFERENCES auth.users(id),
  produto_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create produtos (products) table for marketplace
CREATE TABLE IF NOT EXISTS public.produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_pontos DECIMAL(15, 2) NOT NULL,
  preco_cripto DECIMAL(15, 8),
  imagem_url TEXT,
  categoria TEXT,
  estoque INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pontos policies
CREATE POLICY "Users can view their own balance"
  ON public.pontos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance"
  ON public.pontos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance"
  ON public.pontos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Transacoes policies
CREATE POLICY "Users can view their own transactions"
  ON public.transacoes FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = destinatario_id);

CREATE POLICY "Users can create transactions"
  ON public.transacoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Produtos policies (todos podem ver, mas só admin pode modificar - por enquanto todos podem ver)
CREATE POLICY "Anyone can view active products"
  ON public.produtos FOR SELECT
  USING (ativo = TRUE);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pontos_updated_at
  BEFORE UPDATE ON public.pontos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize user balance when profile is created
CREATE OR REPLACE FUNCTION initialize_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pontos (user_id, saldo)
  VALUES (NEW.user_id, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_balance();

-- Insert sample products
INSERT INTO public.produtos (nome, descricao, preco_pontos, preco_cripto, imagem_url, categoria, estoque) VALUES
('iPhone 15 Pro', 'Apple iPhone 15 Pro 256GB', 15000.00, 0.25, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', 'Eletrônicos', 5),
('Notebook Dell XPS', 'Dell XPS 15 - Intel i7, 16GB RAM', 12000.00, 0.20, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 'Eletrônicos', 3),
('Console PlayStation 5', 'Sony PlayStation 5 Digital Edition', 8000.00, 0.13, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'Games', 8),
('Smartwatch Apple Watch', 'Apple Watch Series 9 GPS', 5000.00, 0.08, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', 'Eletrônicos', 10);