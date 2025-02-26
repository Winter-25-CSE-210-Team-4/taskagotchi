import Header from '../components/ui/Header';
const HomePage = () => {
  return (
    <>
      <Header />
      {/* Add a link to the login page */}
      <div className='flex w-full mt-4 justify-center items-center px-5'>
        <div className='w-1/3 bg-white text-center text-accent border border-accent border-2 py-2 rounded-lg hover:bg-secondary'>
          <a href='/login' className='text-accent'>
            Go to Login
          </a>
        </div>
      </div>
      {/* Add a link to the sign up page */}

      <div className='flex w-full mt-4 justify-center items-center px-5'>
        <div className='w-1/3 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary'>
          <a href='/signup' className='text-white'>
            Go to Sign up
          </a>
        </div>
      </div>
    </>
  );
};
export default HomePage;
