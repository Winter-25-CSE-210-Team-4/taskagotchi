import { useState } from "react";
import React from "react";
import Header from "../components/ui/Header";

/*
 * This page allows the user to reset their password.
 * This page should do the following:
 *   1) When the user submits their new password, the password connected to their email is updated.
 *   2) Redirects them to the login page.
 * Currently this page does nothing.
 */
const ResetPasswordPage = () => {

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
  };

function resetPassword (e) {console.log("Reset!")}

  return (
    <div className="flex flex-col h-screen w-full min-w-[1024px]">
      {/* Header stays at the top */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 justify-center items-center bg-white">
        {/* Login box */}
        <div className="flex flex-col bg-mint/10 py-8 px-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center my-6">Reset Password</h2>

          {/* Login form */}
          <form onSubmit={handle_submit}>

                    <div>
                      <label className="block mb-2 text-left">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={form_data.password}
                        onChange={handle_input}
                        className="w-full p-2 mb-2 border  border-black rounded bg-white"
                        placeholder="Enter your new password"
                      />
                      {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>

                    <div className="w-full mt-4 justify-center items-center px-5">
                      <button
                        type="submit"
                        className="w-full bg-darkmint text-center text-white border border-darkmint py-2 rounded hover:bg-mint"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
};

export default ResetPasswordPage;
