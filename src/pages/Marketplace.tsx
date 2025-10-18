import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redireciona para a nova página de busca/marketplace
const Marketplace = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/busca', { replace: true });
  }, [navigate]);

  return null;
};

export default Marketplace;
