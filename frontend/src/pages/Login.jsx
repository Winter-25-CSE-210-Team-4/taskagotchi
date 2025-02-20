import React from "react";
import Header from "../components/ui/Header";
import useLogin from "../scripts/login.js";


const LoginPage = () => {

  // get javascript functions
  const { form_data, errors, num_attempts, handle_input, handle_submit } = useLogin();

 
  return (
    <div className="flex flex-col h-screen w-full min-w-[1024px]">
      {/* Header stays at the top */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 justify-center items-center bg-white font-inter">
        {/* Login box */}
        <div className="flex flex-col bg-primary/10 py-8 px-6 rounded-lg shadow-md w-1/2 max-w-lg">
          <h2 className="text-2xl text-left mt-6 mb-14">Log in</h2>

          {/* Login form */}
          <form onSubmit={handle_submit}>
                    <div className="flex flex-col flex-1 justify-center items-left">
                      <label className="block mb-2 text-left">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form_data.email}
                        onChange={handle_input}
                        className="w-full p-1 mb-2 border border-black rounded-lg bg-white"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col flex-1 justify-center items-left mb-10">
                      <label className="block mb-2 text-left">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={form_data.password}
                        onChange={handle_input}
                        className="w-full p-1 mb-2 border border-black rounded-lg bg-white"
                        placeholder="Enter your password"
                      />
                      {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>


                    {/* Display error message for failed login attempts */}
                    {errors.general && (
                      <p className={`text-center mb-2 ${num_attempts >= 3 ? "text-red-500" : "text-red-500"}`}>
                        {errors.general}
                      </p>
                    )}

                    <div className="flex w-full mt-4 justify-center items-center px-5">
                      <button
                        type="submit"
                        className="w-1/2 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary"
                      >
                        Login
                      </button>
                    </div>
                  </form>

                  {/* Sign up & Reset Password buttons */}
                  <div className="flex w-full mt-4 justify-center items-center px-5">
                  <a href="/signup" className="btn btn-outline w-1/2 bg-white text-center text-accent border-2 py-2 rounded-lg hover:bg-secondary">
                      Create Account
                  </a>
                  </div>

                  <div className="flex w-full mt-4 justify-center items-center px-5">
                     {/*TODO: change this to proper link */}
                      <a href="/home" className="btn btn-link btn-accent w-1/2 text-center">
                          Reset Password
                      </a>
                  </div>
                </div>
              </div>
            </div>
          );
};

export default LoginPage;
