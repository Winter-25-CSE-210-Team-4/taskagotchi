import { useState } from "react";
import React from "react";
import Header from "../components/ui/Header";
import { Link } from "react-router-dom";

/*
 * This page handles recovering a forgotten password by entering a random code emailed to the user
 * This page should do the following:
 *   1) If the user submits the correct code, redirect to the ResetPassword page.
 *   2) If the user submits the wrong code, show an error.
 * Currently, this page only redirects to the ResetPassword page. 
 * 
 * This page also requires context info from the login page to get the email and recovery code
 */
function RecoveryCodePage() {
    return (
        <div className="flex flex-col h-screen w-full min-w-[1024px]">
          {/* Header stays at the top */}
          <Header />
    
          {/* Main content area */}
          <div className="flex flex-1 justify-center items-center bg-white">
            {/* Login box */}
            <div className="flex flex-col bg-mint/10 py-8 px-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center my-6">A recovery code has been sent to your email</h2>                

                {/* Login form */}
                <form>
                <div>
                    <input
                    type="code"
                    name="code"
                    className="w-full p-2 mb-2 border border-black rounded bg-white"
                    placeholder="Enter code"
                    />
                </div>
                </form>
                
                <div className="w-full mt-4 justify-center items-center px-5 bg-darkmint text-center text-white border border-darkmint py-2 rounded hover:bg-mint">
                    <button
                    type="submit"
                    className="w-full"
                    onClick={()=>{window.location.href = "/reset"}}>
                    Submit
                    </button>
                </div>
                
            </div>
            </div>
        </div>
        );
};
    
export default RecoveryCodePage;
    