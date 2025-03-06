import { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContextProvider';

const useAuth = () => {
  const { setUser, setLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    // Check for stored auth data on hook initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoggedIn(true);
    }
  }, []);
  return useContext(AuthContext);
};

export default useAuth;
