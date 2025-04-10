import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // ou sessionStorage, ou un cookie si tu préfères

    if (token) {
      router.replace('/products/product');
    } else {
      router.replace('/auths/login');
    }
  }, [router]);

  return <p>Redirection en cours...</p>;
};

export default Home;
