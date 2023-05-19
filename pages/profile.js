import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';

export default function profile() {

    return (
        <>
            <div class="p-4 lg:p-16">
                <div class="rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] mt-24">
                    <div className="flex flex-col justify-center text-center h-full bg-[#2F3030] text-white rounded-[10px] p-4">
                        <div class="grid grid-cols-1 md:grid-cols-3">
                            <div class="grid grid-cols-3 text-center order-last md:order-first mt-4 md:mt-0 gap-2 md:gap-4">
                                <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                    <p class="font-bold text-white text-xl">22</p>
                                    <p class="text-gray-400">Wins</p>
                                </div>
                                <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                    <p class="font-bold text-white text-xl">10</p>
                                    <p class="text-gray-400">Biggest Bet</p>
                                </div>
                                <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                    <p class="font-bold text-white text-xl">89</p>
                                    <p class="text-gray-400">Bets</p>
                                </div>
                            </div>
                            <div class="relative">
                                <div class="w-48 h-48 bg-gray-400 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div class="grid grid-cols-3 text-center justify-between mt-32 md:mt-0 md:justify-center gap-2 md:gap-4">
                                <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                    <p class="font-bold text-white text-xl">22</p>
                                    <p class="text-gray-400">Wins</p>
                                </div>
                                <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                    <p class="font-bold text-white text-xl">10</p>
                                    <p class="text-gray-400">Biggest Bet</p>
                                </div>
                                <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                    <p class="font-bold text-white text-xl">89</p>
                                    <p class="text-gray-400">Bets</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-10 md:mt-20 text-center border-b border-[#8b8b8b] pb-12">
                            <h1 class="text-4xl font-medium text-white">0x9a76....e64aef</h1>
                            <p class="font-medium text-white mt-3">Beginner Player</p>


                            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="mt-16 w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                                    <thead
                                        className="text-xs text-white dark:text-white tracking-widest"
                                        style={{ backgroundColor: "#404040" }}
                                    >
                                        <tr className="text-lg 2xl:text-xl">
                                            <th scope="col" className="px-6 py-3">
                                                Game
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Time
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Player
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Wager
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Profit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b border-[#2F3030] 2xl:text-lg dark:border-[#2F3030] text-white" style={{ backgroundColor: "#262626" }}>
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                -
                                            </th>
                                            <td class="px-6 py-4">
                                                -
                                            </td>
                                            <td class="px-6 py-4">
                                                -
                                            </td>
                                            <td class="px-6 py-4">
                                                $-
                                            </td>
                                            <td class="px-6 py-4">
                                                $-
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="mt-12 flex flex-col justify-center">
                            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                                <div className="text-center">
                                    <p className="mt-4 text-2xl font-medium">Buy ZeroHero NFTs on the market now!</p>

                                    <div className="flex flex-col items-center justify-center px-16 mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row sm:px-0">
                                        <a href="#" title="" className="className='w-full py-4 px-10 bg-primary-800 rounded-lg text-black font-bold" role="button"> Shop Now </a>
                                    </div>

                                    <p className="mt-6 text-base text-gray-300">Visit our official website? <a href="#" title="" className="text-primary-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">Here</a></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
