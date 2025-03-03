import { axiosPrivate } from '../../api/axios';
import { useEffect } from 'react';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
  const { auth } = useAuth();

  // interceptors to refresh token and add access token to header
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Clean up for interceptors
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
