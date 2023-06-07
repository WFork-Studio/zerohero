import { useState } from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { GB, ES, DE } from 'country-flag-icons/react/3x2'

export default function Navbar() {
  const wallet = useWallet();
  const { locale } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const languageOptions = [
    { label: 'English', flag: <GB className="w-10 mx-auto" />, locale: 'en' },
    { label: 'Spanish', flag: <ES className="w-10 mx-auto" />, locale: 'es' },
    { label: 'Germany', flag: <DE className="w-10 mx-auto" />, locale: 'de' },
  ];
  return (
    <nav
      className="flex items-center justify-between flex-wrap drop-shadow-xl"
      style={{ backgroundColor: "#2F3030" }}
    >
      <div className="mr-6 2xl:mr-80 flex flex-shrink-0 items-center text-white bg-gradient-to-b from-purple-500 to-purple-500/25 self-stretch pr-20 [clip-path:polygon(0_0,100%_0,calc(100%-theme(spacing.8))_100%,0_100%)]">
        <Link
          className="font-coolvetica pl-10 font-bold text-white text-4xl py-4"
          href="/"
        >
          <img className="icon-logo" src="/images/logo-zh.png" />
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
        >
          <svg
            className={`fill-white h-6 w-6 ${isOpen ? "hidden" : "block"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg
            className={`fill-white h-6 w-6 ${isOpen ? "block" : "hidden"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"
          }`}
      >
        <div className="text-sm text-center lg:flex-grow font-coolveticaCondensed text-white text-xl/8">
          <Link
            href="/"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 lg:mr-8 text-2xl"
          >
            Dashboard
          </Link>
          <Link
            href="/games"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 lg:mr-8 text-2xl"
          >
            Games
          </Link>
          <Link
            href="/statistics"
            className="block mt-4 lg:inline-block lg:mt-0 text-white-200 lg:mr-8 text-2xl"
          >
            Statistics
          </Link>
        </div>
        <div className="block lg:hidden text-center mt-4">
          <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white border border-gray-500 rounded-lg focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button">{locale === 'en' ? <GB className="w-5" /> : locale === 'es' ? <ES className="w-5" /> : <DE className="w-5" />} <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>

          <div id="dropdown" class="z-10 hidden divide-y rounded-lg w-20" style={{ background: '#2F3030' }}>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              {languageOptions.map((option) => (
                <li>
                  <Link href="" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" locale={option.locale}>
                    {option.flag}
                  </Link>
                </li>
              ))
              }
            </ul>
          </div>
        </div>
        <div className="pr-3 text-center my-4 inline-flex profile-area">
          {/* <button
            className="inline-flex items-center border-0 py-3 px-7 text-black rounded-md font-roboto font-bold text-sm"
            style={{ backgroundColor: "#00F0FF" }}
          >
            Connect Wallet
          </button> */}
          <ConnectButton label="Connect Wallet" />
          {wallet?.connected &&
            <Link
              href="/profile"
              className="ml-4 rounded-full border-4 p-2 hover:border-[#00f0ff] transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="white"
                  d="M288 320a224 224 0 1 0 448 0 224 224 0 1 0-448 0zm544 608H160a32 32 0 0 1-32-32v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 0 1-32 32z"
                ></path>
              </svg>
            </Link>
          }


          <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown2" class="hidden lg:inline-flex text-white border border-gray-500 ml-4 rounded-lg focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center items-center" type="button">{locale === 'en' ? <GB className="w-5" /> : locale === 'es' ? <ES className="w-5" /> : <DE className="w-5" />} <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>

          <div id="dropdown2" class="z-10 hidden divide-y rounded-lg w-20" style={{ background: '#2F3030' }}>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              {languageOptions.map((option) => (
                <li>
                  <Link href="" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" locale={option.locale}>
                    {option.flag}
                  </Link>
                </li>
              ))
              }
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
