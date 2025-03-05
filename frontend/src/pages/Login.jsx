import Header from '../components/ui/Header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../auth/hooks/useAuth';

const LoginPage = () => {
  //handles redirection to different pages
  const navigate = useNavigate();

  //Defining email and password as elements to be updated dynamically
  const [form_data, set_form_data] = useState({
    email: '',
    password: '',
  });

  //Initializes errors variable as empty, defines function to set errors
  const [errors, set_errs] = useState({});

  //iitializes variable + function to track login status
  // const [login_status, set_login_status] = useState(false);

  // tracking login attempts
  const [num_attempts, set_num_attempts] = useState(0);

  const { setAuth, setLoggedIn, setUser } = useAuth();

  // //mock user database (to be replaed with backend queries)
  // const mock_data = [
  // { email: "test@gmail.com", password: "password123" },
  // { email: "abc@icloud.com", password: "xyzpassword" },
  // ];

  //Event handler to handle user input as it comes in
  const handle_input = (e) => {
    set_form_data({
      ...form_data,
      [e.target.name]: e.target.value,
    });
    set_errs({ ...errors, [e.target.name]: '', general: '' });
  };

  /*Event handler to handle submissions
      - Will set errrors if required information is not provided*/
  const handle_submit = async (e) => {
    e.preventDefault();
    let curr_errs = {};

    //checks if email and password are present
    if (!form_data.email) {
      curr_errs.email = 'Email is required';
    }
    if (!form_data.password) {
      curr_errs.password = 'Password is required';
    }

    if (Object.keys(curr_errs).length > 0) {
      set_errs(curr_errs);
      return;
    }

    // const curr_user = mock_data.find((user) =>
    //     user.email == form_data.email && user.password == form_data.password);
    try {
      // query the database and save the data recieved
      // will error if data not there
      const response = await axios.post('/auth/login', form_data);

      const { token, user } = response.data;
      console.log('logged in resp', response.data);

      setAuth({ accessToken: token });
      setLoggedIn(true);
      setUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // set_login_status(true);
      set_errs({});

      navigate('/');
    } catch {
      set_num_attempts(num_attempts + 1);
      set_errs({ general: 'Invalid email or password' });

      if (num_attempts >= 3) {
        set_errs({
          general: 'Invalid email or password. Try Reset Password or Sign up.',
        });
      }
    }

    //Sanity check
    console.log('Form Submitted:', form_data);
  };

  return (
    <div className='flex flex-col h-screen w-full min-w-[1024px]'>
      {/* Header stays at the top */}
      <Header />

      {/* Main content area */}
      <div className='flex flex-1 justify-center items-center bg-white font-inter'>
        {/* Login box */}
        <div className='flex flex-col bg-primary/10 py-8 px-6 rounded-lg shadow-md w-1/2 max-w-lg'>
          <h2 className='text-2xl text-left mt-6 mb-14'>Log in</h2>

          {/* Login form */}
          <form onSubmit={handle_submit}>
            <div className='flex flex-col flex-1 justify-center items-left'>
              <label className='block mb-2 text-left'>Email</label>
              <input
                type='email'
                name='email'
                value={form_data.email}
                onChange={handle_input}
                className='w-full p-1 mb-2 border border-black rounded-lg bg-white'
                placeholder='Enter your email'
              />
              {errors.email && (
                <p className='text-red-500 text-xs'>{errors.email}</p>
              )}
            </div>

            <div className='flex flex-col flex-1 justify-center items-left mb-10'>
              <label className='block mb-2 text-left'>Password</label>
              <input
                type='password'
                name='password'
                value={form_data.password}
                onChange={handle_input}
                className='w-full p-1 mb-2 border border-black rounded-lg bg-white'
                placeholder='Enter your password'
              />
              {errors.password && (
                <p className='text-red-500 text-xs'>{errors.password}</p>
              )}
            </div>

            {/* Display error message for failed login attempts */}
            {errors.general && (
              <p
                className={`text-center mb-2 ${
                  num_attempts >= 3 ? 'text-red-500' : 'text-red-500'
                }`}
              >
                {errors.general}
              </p>
            )}

            <div className='flex w-full mt-4 justify-center items-center px-5'>
              <button
                type='submit'
                className='w-1/2 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary'
              >
                Login
              </button>
            </div>
          </form>

          {/* Sign up & Reset Password buttons */}
          <div className='flex w-full mt-4 justify-center items-center px-5'>
            <a
              href='/signup'
              className='btn btn-outline w-1/2 bg-white text-center text-accent border-2 py-2 rounded-lg hover:bg-secondary'
            >
              Create Account
            </a>
          </div>

          <div className='flex w-full mt-4 justify-center items-center px-5'>
            {/*TODO: change this to proper link */}
            <a
              href='/home'
              className='btn btn-link btn-accent w-1/2 text-center'
            >
              Reset Password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
