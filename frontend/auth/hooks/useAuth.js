import { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContextProvider';

const useAuth = () => {
  const { setUser, setLoggedIn, setAuth } = useContext(AuthContext);
  useEffect(() => {
    // Check for stored auth data on hook initialization
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setAuth({ accessToken: storedToken });
      setLoggedIn(true);
    }
  }, []);
  return useContext(AuthContext);
};

export default useAuth;
