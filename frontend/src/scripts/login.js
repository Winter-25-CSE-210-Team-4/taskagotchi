import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


const useLogin = () => {

    //handles redirection to different pages
    const navigate = useNavigate();

    //Defining email and password as elements to be updated dynamically
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

    // //mock user database (to be replaed with backend queries)
    // const mock_data = [
    // { email: "test@gmail.com", password: "password123" },
    // { email: "abc@icloud.com", password: "xyzpassword" },
    // ];


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
    const handle_submit = async (e) => {
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

    // const curr_user = mock_data.find((user) => 
    //     user.email == form_data.email && user.password == form_data.password);
    try {

        // query the database and save the data recieved 
        // will error if data not there
        const response = await axios.post("http://localhost:5000/api/auth/login", form_data);

        const { token, user } = response.data;

        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        set_login_status(true);
        set_errs({});

        navigate("/home");
    } catch (error){
        set_num_attempts(num_attempts + 1);
        set_errs({ general: "Invalid email or password" });

        if (num_attempts >= 3) {
            set_errs({ general: "Invalid email or password. Try Reset Password or Sign up." });
        }
    }

    // if (!curr_user) {
    //     set_num_attempts(num_attempts + 1);
    //     set_errs({ general: "Invalid email or password" });

    //     if (num_attempts >= 3) {
    //     set_errs({ general: "Invalid email or password. Try Reset Password or Sign up." });
    //     }
    //     return;
    // }
    
    //Sanity check
    console.log("Form Submitted:", form_data);
    
    
    // navigate("/home");
    };

    return {
        form_data,
        errors,
        num_attempts,
        handle_input,
        handle_submit,
      };
};

export default useLogin;

