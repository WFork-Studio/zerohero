import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className="flex items-center justify-between flex-wrap p-6 drop-shadow-xl nav_dropshadow"
      style={{ backgroundColor: "#2F3030" }}
    >
      <div className="flex items-center flex-shrink-0 text-white mr-6 lg:mr-96">
        {/* <img src={zerohero} className="w-100 h-10 mr-2" alt="Logo" />
         */}
        <a className="text-white lg:text-4xl font-coolvetica font-bold">
          ZeroHero
        </a>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
        >
          <svg
            className={`fill-white h-3 w-3 ${isOpen ? "hidden" : "block"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg
            className={`fill-white h-3 w-3 ${isOpen ? "block" : "hidden"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="text-sm lg:flex-grow font-coolveticaCondensed text-white text-xl/8">
          <a
            href="#"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
          >
            Games
          </a>
          <a
            href="#"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
          >
            Statistics
          </a>
        </div>
        <div>
          <button
            className="inline-flex items-center border-0 py-4 px-10 text-black rounded-md font-roboto font-bold"
            style={{ backgroundColor: "#00F0FF" }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
