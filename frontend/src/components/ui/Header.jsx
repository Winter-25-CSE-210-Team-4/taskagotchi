import React from "react";

const Header = () => {
  return (
    <div className="bg-lightmint py-4 px-6 flex justify-between items-center w-full">
      <div className="flex items-center">
        {/* <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> */}
        <h1 className="text-lg font-bold">TaskagoTchi</h1>
      </div>
      <div className="text-sm text-gray-700 hover:text-gray-900">CN</div>
    </div>
  );
};

export default Header;