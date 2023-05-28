import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import { useWallet } from '@suiet/wallet-kit';
import { getPlayerHistories, getPlayerWager, getPlayerProfit, getPlayerWins, getPlayerBets, getPlayerFavoriteGame, getPlayerBiggestBet } from './api/db_services';
import LoadingSpinner from '../components/Spinner';
import moment from 'moment';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from "next/router";

export function configureMoment(langauge) {
  moment.locale(langauge);
}

export default function profile() {
    const { t } = useTranslation('global');
    const { locale } = useRouter();
    const wallet = useWallet();
    const [playerHistories, setPlayerHistories] = useState([]);
    const [isLoad, setisLoad] = useState();
    const [totalWager, setTotalWager] = useState();
    const [totalProfit, setTotalProfit] = useState();
    const [totalWins, setTotalWins] = useState();
    const [totalBets, setTotalBets] = useState();
    const [totalBiggestBet, setTotalBiggestBet] = useState();
    const [totalFavoriteGame, setTotalFavoriteGame] = useState();

    const getHistories = async (e) => {
        const resp = await getPlayerHistories(wallet.address, 10);
        const wager = await getPlayerWager(wallet.address);
        const profit = await getPlayerProfit(wallet.address);
        const wins = await getPlayerWins(wallet.address);
        const bets = await getPlayerBets(wallet.address);
        const fav = await getPlayerFavoriteGame(wallet.address);
        const biggest_bet = await getPlayerBiggestBet(wallet.address);
        setPlayerHistories(resp);
        setTotalWager(wager[0]?.totalWager);
        setTotalProfit(profit[0]?.totalProfit);
        setTotalWins(wins[0]?.totalWins);
        setTotalBets(bets[0]?.totalBets);
        setTotalFavoriteGame(fav[0]?.gameName);
        setTotalBiggestBet(biggest_bet[0].biggestBet);
        setisLoad(true);
    };

    useEffect(() => {
        if (wallet?.connected) {
            console.log('connected');
            getHistories();
        }
    }, [wallet]);

    useEffect(() => {
      configureMoment(locale);
    }, [locale]);

    useEffect(() => {
        console.log(playerHistories);
    }, [playerHistories]);

    if (isLoad) {
        return (
            <>
                <div class="p-4 lg:p-16">
                    <div class="rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] mt-24">
                        <div className="flex flex-col justify-center text-center h-full bg-[#2F3030] text-white rounded-[10px] p-4">
                            <div class="grid grid-cols-1 md:grid-cols-3">
                                <div class="grid grid-cols-3 text-center order-last md:order-first mt-4 md:mt-0 gap-2 md:gap-4">
                                    <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                        <div className='flex justify-center items-center'>
                                            <p class="font-bold text-white text-xl pl-4">{totalWager.toFixed(2)}</p>
                                            <img
                                                src="/images/sui_brand.png"
                                                alt="Sui Brand"
                                            />
                                        </div>
                                        <p class="text-gray-400">{t('profile_content.wagered')}</p>
                                    </div>
                                    <div className='py-4 rounded-lg' style={{ backgroundColor: "#262626" }}>
                                        <div className='flex justify-center items-center'>
                                            <p class="font-bold text-white text-xl pl-4">{totalBiggestBet.toFixed(2)}</p>
                                            <img
                                                src="/images/sui_brand.png"
                                                alt="Sui Brand"
                                            />
                                        </div>
                                        <p class="text-gray-400">{t('profile_content.biggest_bet')}</p>
                                    </div>
                                    <div className='py-4 rounded-lg flex justify-center items-center' style={{ backgroundColor: "#262626" }}>
                                        <div>
                                            <p class="font-bold text-white text-xl">{totalBets}</p>
                                            <p class="text-gray-400">{t('profile_content.bets')}</p>
                                        </div>
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
                                    <div className='py-4 rounded-lg flex justify-center items-center' style={{ backgroundColor: "#262626" }}>
                                        <div>
                                            <div className='flex justify-center items-center'>
                                                <p class="font-bold text-xl pl-4 text-green-500">+{totalProfit.toFixed(2)}</p>
                                                <img
                                                    src="/images/sui_brand.png"
                                                    alt="Sui Brand"
                                                />
                                            </div>
                                            <p class="text-gray-400">{t('profile_content.profit')} +</p>
                                        </div>
                                    </div>
                                    <div className='py-4 rounded-lg flex justify-center items-center' style={{ backgroundColor: "#262626" }}>
                                        <div>
                                            <p class="font-bold text-white text-xl">{totalWins}</p>
                                            <p class="text-gray-400">{t('profile_content.wins')}</p>
                                        </div>
                                    </div>
                                    <div className='py-4 rounded-lg flex justify-center items-center' style={{ backgroundColor: "#262626" }}>
                                        <div>
                                            <p class="font-bold text-white text-xl px-2">{totalFavoriteGame}</p>
                                            <p class="text-gray-400">{t('profile_content.favorite_game')}</p>
                                        </div>
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
                                                {t('profile_content.game')}
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                {t('profile_content.time')}
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                {t('profile_content.player')}
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                {t('profile_content.wager')}
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                {t('profile_content.profit')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {playerHistories.map((stat, index) => (
                                                <tr class="border-b border-[#2F3030] 2xl:text-lg dark:border-[#2F3030] text-white" style={{ backgroundColor: "#262626" }}>
                                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {stat.gameName}
                                                    </th>
                                                    <td class="px-6 py-4">
                                                        {moment(stat.__createdtime__).fromNow()}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        {stat.walletAddress.substr(0, 4) +
                                                            "....." +
                                                            stat.walletAddress.substr(
                                                                stat.walletAddress.length - 4,
                                                                stat.walletAddress.length
                                                            )}{" "}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <div className="flex items-center">
                                                            {stat.wager}
                                                            <img src="/images/sui_brand.png" alt="Sui Brand" />
                                                        </div>
                                                    </td>
                                                    {stat.profit == 0 ? (
                                                        <td className="px-6 py-1 text-red-500">
                                                            <div className="flex items-center">
                                                                -{stat.wager}
                                                                <img
                                                                    src="/images/sui_brand.png"
                                                                    alt="Sui Brand"
                                                                />
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td className="px-6 py-1 text-green-500">
                                                            <div className="flex items-center">
                                                                +{stat.profit}
                                                                <img
                                                                    src="/images/sui_brand.png"
                                                                    alt="Sui Brand"
                                                                />
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            <div class="mt-12 flex flex-col justify-center mb-6">
                                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                                    <div className="text-center">
                                        <p className="text-2xl font-medium">{t('profile_content.buy_nft')}</p>

                                        <div className="flex flex-col items-center justify-center px-16 mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row sm:px-0">
                                            <a href="#" title="" className="className='w-full py-4 px-10 bg-primary-800 rounded-lg text-black font-bold" role="button"> {t('profile_content.shop_now')} </a>
                                        </div>

                                        <p className="mt-6 text-base text-gray-300">{t('profile_content.visit_website')}? <a href="#" title="" className="text-primary-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">{t('profile_content.here')}</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Footer />
            </>
        )
    } else {
        return <LoadingSpinner />
    }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['global']))
    }
  };
}
