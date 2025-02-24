import { useState } from "react";
import React from "react";
import { useNavigate, Navigate } from "react-router-dom"
import Header from "../components/ui/Header";
import useLogin from "../scripts/login.js";

const LoginPage = () => {
  //handles redirection to different pages
  const navigate = useNavigate();

  //Defining email and password as elemenets to be updated dynamically
  const [form_data, set_form_data] = useState({
    email: "",
    password: "",
  });

  //Initializes errors variable as empty, defines function to set errors
  const [errors, set_errs] = useState({});

  //iitializes variable + function to track login status
  const [login_status, set_login_status] = useState(false);

  // tracking login attempts
  const [num_attempts, set_num_attempts] = useState(0);

  //mock user database (to be replaed with backend queries)
  const mock_data = [
    { email: "test@gmail.com", password: "password123" },
    { email: "abc@icloud.com", password: "xyzpassword" },
  ];


  //Event handler to handle user input as it comes in
  const handle_input = (e) => {
    set_form_data({
      ...form_data,
      [e.target.name]: e.target.value,
    });
    set_errs({ ...errors, [e.target.name]: "", general: "" });
  };

  /*Event handler to handle submissions
      - Will set errrors if required information is not provided*/
  const handle_submit = (e) => {
    e.preventDefault();
    let curr_errs = {};

    //checks if email and password are present
    if (!form_data.email) {
      curr_errs.email = "Email is required";
    }
    if (!form_data.password) {
      curr_errs.password = "Password is required";
    }

    if (Object.keys(curr_errs).length > 0) {
      set_errs(curr_errs);
      return;
    }

    const curr_user = mock_data.find((user) => 
      user.email == form_data.email && user.password == form_data.password);

    if (!curr_user) {
      set_num_attempts(num_attempts + 1);
      set_errs({ general: "Invalid email or password" });

      if (num_attempts >= 3) {
        set_errs({ general: "Try Reset Password or Sign up." });
      }
      return;
    }
    
    //Sanity check
    console.log("Form Submitted:", form_data);
    
    navigate("/home");
  };

const emailIsRegistered = (email) => {
  return mock_data.find((user) => user.email == email) // temporary until backend
}

/*
 * Event handler for "Forgot password"
 * It should do the following:
 *   1) If the given email is a registered email, proceed. Otherwise give alert.
 *   2) Create a random recovery code
 *   3) Send an email with the recovery code
 *   4) Redirect to the RecoveryCode page
 * Currently, it only generates the code and redirects.
 */
const handleForgot = (e) => {
  if (!emailIsRegistered(form_data.email)) {
    set_errs({ general: "The entered email is not registered. Sign up to continue." });
    return;
  }
  const recoveryCode = Math.floor(Math.random() * 9000 + 1000);
  console.log(`Should send email with code ${recoveryCode} to ${form_data.email}` );
  navigate("/recovery", {state: {email: form_data.email, recoveryCode: recoveryCode}});
}

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

                  <div className="w-full mt-4 justify-center items-center px-5">
                    <div className="bg-white text-center text-darkmint border border-darkmint py-2 rounded hover:bg-lightmint">
                      <button onClick={handleForgot}>Reset password</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
};

export default LoginPage;
