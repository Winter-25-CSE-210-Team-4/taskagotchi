import { useContext, useState } from "react";
import React from "react";
import Header from "../components/ui/Header";
import { useLocation, useNavigate } from "react-router-dom";

/*
 * This page is part of the reset password flow. It requires the user to enter a recovery code.
 */
function RecoveryCodePage() {

	const navigate = useNavigate()

	const location = useLocation();
	const { email, recoveryCode } = location.state || {};

	const [inputCode, setInputCode] = useState(-1);
	const [showError, setError] = useState(false);

	function handleSubmit(e) {
		e.preventDefault();
		if (inputCode !== recoveryCode) {
			setError(true);
			return;
		}
		navigate('/reset', {state: {email: email}})
	}

	return (
		<div className="flex flex-col h-screen w-full min-w-[1024px] bg-white">
			<Header/>
			<form onSubmit={handleSubmit} className='flex justify-center'>
				<div className='w-[32rem] flex flex-col py-8 px-6 rounded-lg shadow-md w-full max-w-md'>
					<p
						className='py-2'>
						A recovery code has been sent to {email}. Really, it's just in the console.
					</p>
					<div
						className='flex flex-row gap-2'>
						<input
							type='number'
							id='code'
							className='w-1/2 p-2 mb-2 border border-black rounded bg-white'
							placeholder='Enter recovery code'
							onChange={(e)=>setInputCode(Number(e.target.value))}>
						</input>
						
						<button
							type='submit'
							className='btn btn-primary flex flex-row items-center'>
								Submit
						</button>
					</div>
					{showError && <p className="text-red-500">Incorrect code</p>}
				</div>
			</form>
		</div>
	);
};
	
export default RecoveryCodePage;
	