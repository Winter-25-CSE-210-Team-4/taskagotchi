import React from "react";

const Header = () => {
  return (
    <div className="bg-secondary py-4 px-6 flex justify-between items-center w-full">
      <div className="flex items-center px-4">
        {/* <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> */}
        <a href='/'>
          <h1 className="text-4xl font-bold font-nanum">Taskagotchi</h1>
        </a>
      </div>
      {/* <div className="text-sm text-gray-700 hover:text-gray-900">CN</div> */}
    </div>
  );
};

export default Header;