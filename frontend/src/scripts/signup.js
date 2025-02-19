import { useState } from "react";

const useSignup = () => {
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

    return {
        form_data,
        errors,
        handle_input,
        handle_submit,
      };


};

export default useSignup;