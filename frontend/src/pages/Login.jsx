import { useState } from "react";
import React from "react";
import Header from "../components/ui/Header";

const LoginPage = () => {

  //Defining email and password as elemenets to be updated dynamically
  const [form_data, set_form_data] = useState({
    email: "",
    password: "",
  });

  //Initializes errors variable as empty, defines function to set errors
  const [errors, set_errs] = useState({});

  //iitializes variable + function to track login status
  const [login_status, set_login_status] = useState(false);

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
      set_errs({ general: "Invalid email or password" });
      return;
    }
    
    //Sanity check
    console.log("Form Submitted:", form_data);
  };



  return (
    <div className="flex flex-col h-screen w-full min-w-[1024px]">
      {/* Header stays at the top */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 justify-center items-center bg-white">
        {/* Login box */}
        <div className="flex flex-col bg-mint/10 py-8 px-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center my-6">Log in</h2>

          {/* Login form */}
          <form onSubmit={handle_submit}>
                    <div>
                      <label className="block mb-2 text-left">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form_data.email}
                        onChange={handle_input}
                        className="w-full p-2 mb-2 border border-black rounded bg-white"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-left">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={form_data.password}
                        onChange={handle_input}
                        className="w-full p-2 mb-2 border  border-black rounded bg-white"
                        placeholder="Enter your password"
                      />
                      {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>

                    
                    {errors.general && <p className="text-red-500 text-center mb-2">{errors.general}</p>}

                    <div className="w-full mt-4 justify-center items-center px-5">
                      <button
                        type="submit"
                        className="w-full bg-darkmint text-center text-white border border-darkmint py-2 rounded hover:bg-mint"
                      >
                        Login
                      </button>
                    </div>
                  </form>

                  {/* Sign up & Reset Password buttons */}
                  <div className="w-full mt-4 justify-center items-center px-5">
                    <div className="bg-darkmint text-center text-white border border-darkmint py-2 rounded hover:bg-mint">
                      Sign up
                    </div>
                  </div>

                  <div className="w-full mt-4 justify-center items-center px-5">
                    <div className="bg-white text-center text-darkmint border border-darkmint py-2 rounded hover:bg-lightmint">
                      Reset password
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
};

export default LoginPage;
