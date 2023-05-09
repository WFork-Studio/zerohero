import { useState } from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";

export default function Navbar() {
  const wallet = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className="flex items-center justify-between flex-wrap drop-shadow-xl nav_dropshadow"
      style={{ backgroundColor: "#2F3030" }}
    >
      <div className="mr-6 lg:mr-80 flex flex-shrink-0 items-center text-white bg-gradient-to-b from-purple-500 to-purple-500/25 self-stretch pr-20 [clip-path:polygon(0_0,100%_0,calc(100%-theme(spacing.8))_100%,0_100%)]">
        <a
          className="font-coolvetica pl-10 font-bold text-white text-4xl py-4"
          href="/"
        >
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
            href="/"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
          >
            Dashboard
          </a>
          <a
            href="/games"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
          >
            Games
          </a>
          <a
            href="/statistics"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
          >
            Statistics
          </a>
        </div>
        <div className="pr-3">
          {/* <button
            className="inline-flex items-center border-0 py-3 px-7 text-black rounded-md font-roboto font-bold text-sm"
            style={{ backgroundColor: "#00F0FF" }}
          >
            Connect Wallet
          </button> */}
          <ConnectButton label="Connect Wallet" />
        </div>
      </div>
    </nav>
  );
}
