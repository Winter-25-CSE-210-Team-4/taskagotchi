import Header from '../components/ui/Header';
import { useState } from 'react';
import axios from '../../api/axios';
import useAuth from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [form_data, set_form_data] = useState({
    email: '',
    name: '',
    password: '',
  });
  const { setAuth, setLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  //Initializes errors variable as empty, defines function to set errors
  const [errors, set_errs] = useState({});

  // Initialize confirm password varaibles as empty, define function to set it
  const [confirm_password, set_confirm_password] = useState('');

  //Event handler to handle user input as it comes in
  const handle_input = (e) => {
    if (e.target.name == 'confirm_password') {
      set_confirm_password(e.target.value);
    } else {
      set_form_data({
        ...form_data,
        [e.target.name]: e.target.value,
      });
      set_errs({ ...errors, [e.target.name]: '', general: '' });
    }
  };

  /*Event handler to handle submissions
          - Will set errrors if required information is not provided*/
  const handle_submit = async (e) => {
    e.preventDefault();
    let curr_errs = {};

    //checks if email and password, and username are present
    if (!form_data.email) {
      curr_errs.email = 'Email is required';
    }

    if (!form_data.password) {
      curr_errs.password = 'Password is required';
    } else {
      if (form_data.password.includes(' ')) {
        curr_errs.password = 'Password cannot contain spaces';
      }
      if (form_data.password.length > 20) {
        curr_errs.password = 'Password cannot be more than 20 characters';
      }
    }

    if (!form_data.name) {
      curr_errs.name = 'Name is required';
    }

    if (!confirm_password) {
      curr_errs.confirm_password = 'Confirm Password is required';
    }

    // checks if passwords match - only if confirm password is provided
    else if (form_data.password !== confirm_password) {
      curr_errs.confirm_password = 'Passwords do not match';
    }

    const submission_data = {
      ...form_data,
      email: form_data.email.toLowerCase(), // Email converted to lowercase here
    };

    if (Object.keys(curr_errs).length > 0) {
      set_errs(curr_errs);
      return;
    }

    // querying database to check if account with email already exists
    try {
      const response = await axios.post('/auth/register', submission_data);

      if (response.status < 200 || response.status > 299) {
        throw new Error(response.data.message || 'Failed to register');
      }

      const { token, user } = response.data.data;

      setAuth({ accessToken: token });
      setLoggedIn(true);
      setUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      //Sanity check
      console.log('Form Submitted:', submission_data);

      set_form_data({ email: '', name: '', password: '' });
      set_confirm_password('');
      set_errs({});

      navigate('/home');
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data?.message || error.message
      ); //fix here
      set_errs({
        general: error.response?.data?.message || 'Registration failed',
      });
      //set_errs({ general: error.message });
    }
  };

  return (
    <div className='flex flex-col h-screen w-full min-w-[1024px]'>
      {/* Header stays at the top */}
      <Header />

      {/* Main content area */}
      <div className='flex flex-1 justify-center items-center bg-white font-inter'>
        {/* Sign up box */}
        <div className='flex flex-col bg-primary/10 py-8 px-6 rounded-lg shadow-md w-1/2 max-w-lg'>
          <h2 className='text-2xl text-left mt-6 mb-14'>Sign up</h2>

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

            <div className='flex flex-col flex-1 justify-center items-left'>
              <label className='block mb-2 text-left'>Username</label>
              <input
                type='text'
                name='name'
                value={form_data.name}
                onChange={handle_input}
                className='w-full p-1 mb-2 border border-black rounded-lg bg-white'
                placeholder='Enter your name'
              />
              {errors.name && (
                <p className='text-red-500 text-xs'>{errors.name}</p>
              )}
            </div>

            <div className='flex flex-col flex-1 justify-center items-left'>
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
            <div className='flex flex-col flex-1 justify-center items-left mb-10'>
              <label className='block mb-2 text-left'>Confirm Password</label>
              <input
                type='password'
                name='confirm_password'
                value={confirm_password}
                onChange={handle_input}
                className='w-full p-1 mb-2 border border-black rounded-lg bg-white'
                placeholder='Confirm your password'
              />
              {errors.confirm_password && (
                <p className='text-red-500 text-xs'>
                  {errors.confirm_password}
                </p>
              )}
            </div>
            {/* Display error message for failed login attempts */}
            {errors.general && (
              <p className={'text-red-500 text-xs'}>{errors.general}</p>
            )}

            <div className='flex w-full mt-4 justify-center items-center px-5'>
              <button
                type='submit'
                className='w-1/3 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary'
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Sign up & Reset Password buttons */}
          <div className='flex w-full mt-4 justify-center items-center px-5'>
            <a
              href='/login'
              className='w-1/3 bg-white text-center text-accent border border-accent border-2 py-2 rounded-lg hover:bg-secondary'
            >
              Go to log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
