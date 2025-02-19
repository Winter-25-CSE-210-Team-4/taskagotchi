import { useState } from "react";
import React from "react";
import Header from "../components/ui/Header";


const SignupPage = () => {

    const [form_data, set_form_data] = useState({
        email: "",
        name:"",
        password: "",
    });

      //Initializes errors variable as empty, defines function to set errors
    const [errors, set_errs] = useState({});

    
    //Event handler to handle user input as it comes in
    const handle_input = (e) => {
        set_form_data({
        ...form_data,
        [e.target.name]: e.target.value,
        });
        set_errs({ ...errors, [e.target.name]: "", general: "" });
    };

    // TODO: decide if user_id should be created in the front end or the backend and how it should be created
     /*Event handler to handle submissions
      - Will set errrors if required information is not provided*/
    const handle_submit = (e) => {
        e.preventDefault();
        let curr_errs = {};

        // TODO: add an error checking for duplicated emails in existing data
        //checks if email and password are present
        if (!form_data.email) {
        curr_errs.email = "Email is required";
        }

        if (!form_data.password) {
        curr_errs.password = "Password is required";
        }

        if (!form_data.name) {
            curr_errs.name = "Name is required";
        }

        if (Object.keys(curr_errs).length > 0) {
            set_errs(curr_errs);
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
            <div className="flex flex-1 justify-center items-center bg-white font-inter">
                {/* Sign up box */}
                <div className="flex flex-col bg-primary/10 py-8 px-6 rounded-lg shadow-md w-1/2 max-w-lg">
                    <h2 className="text-2xl text-left mt-6 mb-14">Sign up</h2>

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

                        <div className="flex flex-col flex-1 justify-center items-left">
                            <label className="block mb-2 text-left">User Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form_data.name}
                                onChange={handle_input}
                                className="w-full p-1 mb-2 border border-black rounded-lg bg-white"
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
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
                                className="w-1/3 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    {/* Sign up & Reset Password buttons */}
                    <div className="flex w-full mt-4 justify-center items-center px-5">
                        <a href='/login' className="w-1/3 bg-white text-center text-accent border border-accent border-2 py-2 rounded-lg hover:bg-secondary">
                            Go to log in
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;
