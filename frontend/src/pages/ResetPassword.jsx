import { useState } from "react";
import Header from "../components/ui/Header";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {

  const navigate = useNavigate()

	const location = useLocation();
	const { email } = location.state || {};

  // temporary mock data
  const mock_data = [
    { email: "test@gmail.com", password: "password123" },
    { email: "abc@icloud.com", password: "xyzpassword" },
  ];

	const [newPass, setNewPass] = useState(-1);

  // temporary until backend is connected
  function updatePassword() {
    const user = mock_data.find((user) => user.email == email)
    user.password = newPass;
    console.log(`${email} has new password ${user.password}`)
  }

	function handleSubmit(e) {
		e.preventDefault();
    updatePassword();
		navigate('/login');
	}

  return (
		<div className="flex flex-col h-screen w-full min-w-[1024px] bg-white">
			<Header/>
			<form onSubmit={handleSubmit} className='flex justify-center'>
				<div className='w-[32rem] flex flex-col py-8 px-6 rounded-lg shadow-md w-full max-w-md'>
					<h2
						className='py-2'>
						Reset Password
					</h2>
          <input
            type='password'
            id='password'
            className='w-1/2 p-2 mb-2 border border-black rounded bg-white'
            placeholder='Enter new password'
            onChange={(e)=>setNewPass(e.target.value)}>
          </input>
          
          <button
            type='submit'
            className='btn btn-primary flex flex-row items-center'>
              Submit
          </button>
				</div>
			</form>
		</div>
	);
};

export default ResetPasswordPage;
