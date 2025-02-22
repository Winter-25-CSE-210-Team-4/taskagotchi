import { useState } from "react";

const useSignup = () => {
    const [form_data, set_form_data] = useState({
        email: "",
        name:"",
        password: "",
    });

      //Initializes errors variable as empty, defines function to set errors
    const [errors, set_errs] = useState({});

    // Initialize confirm password varaibles as empty, define function to set it
    const  [confirm_password, set_confirm_password] = useState("");
    
    //Event handler to handle user input as it comes in
    const handle_input = (e) => {

        if (e.target.name == "confirm_password") {
            set_confirm_password(e.target.value);
        } else {
            set_form_data({
                ...form_data,
                [e.target.name]: e.target.value,
                });
                set_errs({ ...errors, [e.target.name]: "", general: "" });
        }
    };

     /*Event handler to handle submissions
      - Will set errrors if required information is not provided*/
    const handle_submit = async (e) => {
        e.preventDefault();
        let curr_errs = {};

        //checks if email and password, and username are present
        if (!form_data.email) {
        curr_errs.email = "Email is required";
        }

        if (!form_data.password) {
            curr_errs.password = "Password is required";
        }

        if (!form_data.name) {
            curr_errs.name = "Name is required";
        }

        if (!confirm_password) {
            curr_errs.confirm_password = "Confirm Password is required";
        } 
        
        // checks if passwords match - only if confirm password is provided
        else if (form_data.password !== confirm_password) {
            curr_errs.confirm_password = "Passwords do not match";
        }

        if (Object.keys(curr_errs).length > 0) {
            set_errs(curr_errs);
            return;
        }
        
        // querying database to check if account with email already exists
        // TODO: Fix backend issues Discuss CORS issues, fronted not able to access backend
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form_data),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            //sanity check
            console.log("✅ User registered successfully:", data);


            // TODO: Store user token and redirect to homepage

        } catch (error) {
            console.error("Registration error:", error.message);
            set_errs({ general: error.message });
        }

  
        //Sanity check
        console.log("Form Submitted:", form_data);
    };

    return {
        form_data,
        errors,
        confirm_password,
        handle_input,
        handle_submit,
      };


};

export default useSignup;