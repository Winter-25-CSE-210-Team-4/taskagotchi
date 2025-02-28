import Header from '../components/ui/Header';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';
import { useEffect } from 'react';
const HomePage = () => {
  const navigate = useNavigate();
  // add this hook to get the current auth state
  const { user, loggedIn, auth } = useAuth();

  // used to demo changes in the auth state
  useEffect(() => {
    console.log('Auth state updated:', user, loggedIn, auth);
  }, [user, loggedIn, auth]);
  return (
    <>
      <Header />
      {/* Example where using loggedIn state to conditionally render content */}
      <p>is loggedin {loggedIn.toString()}</p>
      {loggedIn ? <p>Logged in as {user.name}</p> : null}
      <div className='flex w-full mt-4 justify-center items-center px-5'>
        <div
          className='w-1/3 bg-white text-center text-accent border border-accent border-2 py-2 rounded-lg hover:bg-secondary'
          onClick={() => navigate('/login')}
        >
          <div className='text-accent'>Login</div>
        </div>
      </div>
      {/* Add a link to the sign up page */}

      <div className='flex w-full mt-4 justify-center items-center px-5'>
        <div
          className='w-1/3 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary'
          onClick={() => navigate('/signup')}
        >
          <div className='text-white'>Sign up</div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
