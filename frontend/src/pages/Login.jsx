import React from "react";
import Header from "../components/ui/Header";

const LoginPage = () => {
  return (
    <div className="flex flex-col h-screen w-full min-w-[1024px]">
      {/* Header stays at the top */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 justify-center items-center bg-white">
        {/* Login box */}
        <div className="flex flex-col bg-mint/10 py-8 px-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-left my-6">Log in</h2>
          <div className="">
            <label className="block mb-2 text-left">Email</label>
            <input
              type="email"
              className="w-full p-2 mb-4 border border-black rounded bg-white"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="">
            <label className="block mb-2 text-left">Password</label>
            <input
              type="password"
              className="w-full p-2 mb-6 border rounded"
              placeholder="Enter your password"
            />
          </div>

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
