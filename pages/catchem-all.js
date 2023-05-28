import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import LoadingSpinner from "../components/Spinner";
import path from "path";
import fsPromises from "fs/promises";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { useWallet, useAccountBalance, ConnectButton } from "@suiet/wallet-kit";
import {
  JsonRpcProvider,
  testnetConnection,
  TransactionBlock,
  Inputs
} from "@mysten/sui.js";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-confetti";
import { storeHistory, getAllHistories } from "./api/db_services";
import moment from "moment";
import Footer from "../components/Footer";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from "next/router";
import 'moment/locale/de';
import 'moment/locale/es';
const provider = new JsonRpcProvider(testnetConnection);

export function configureMoment(langauge) {
  moment.locale(langauge);
}

export default function CatchemAll(statsDatas) {
  const { t } = useTranslation('global');
  const { locale } = useRouter();
  const wallet = useWallet();
  const { balance: walletBalance } = useAccountBalance();
  const [domLoaded, setDomLoaded] = useState(false);
  const [Wager, setWager] = useState(1);
  const [MultipleBets, setMultipleBets] = useState(1);
  const [MaxPayout, setMaxPayout] = useState(0);
  const [TotalWager, setTotalWager] = useState(0);
  const [MinBet, setMinBet] = useState();
  const [MaxBet, setMaxBet] = useState();
  const [RecentlyPlay, setRecentlyPlay] = useState();
  const [isLoad, setisLoad] = useState();
  const [IsConfetti, setIsConfetti] = useState(false);
  const [StatusGame, setStatusGame] = useState("ready");
  const [IsWin, setIsWin] = useState(false);
  const stats = statsDatas.statistics;
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTabletOrMobile = useMediaQuery({ maxWidth: 991.9 });

  const contextClass = {
    info: "bg-[#6103bf]",
  };

  const calculateBet = async () => {
    // Calculate Total Wager
    var total_wager = Number(Wager) * Number(MultipleBets);
    setTotalWager(total_wager.toFixed(2));

    // Calculate Max Payout
    var max_payout = Number(total_wager) * 2;
    let fee_percentage = 0.05;
    let payout_total = max_payout * (1 - fee_percentage);
    setMaxPayout(payout_total.toFixed(2));
  };

  const getMinMax = async (e) => {
    const txn = await provider.getObject({
      id: "0x4636ec6eeb986b3c1f09931b3abfd166692d64d514b7ee9c1c356fb605cb6d8d",
      // fetch the object content field
      options: { showContent: true },
    });

    var minBet = txn?.data?.content?.fields?.min_bet / 1000000000;
    setMinBet(minBet);

    let bank = Number(txn?.data?.content?.fields?.bank) / 1000000000;
    let max = (bank * txn?.data?.content?.fields?.max_bet) / 10000;
    setMaxBet(Number(max.toFixed(1)));
  };

  const playGame = async (e) => {
    var wager = Number(TotalWager) * 1000000000;
    try {
      if (Number(walletBalance) > wager) {
        const betValue = Number(TotalWager) * 1000000000;

        const packageId =
          "0x8c9a415d0d7eef5264a794174c9683d1f161a658d0ee9e10a1a9e5ada459e893";
        const catchemAllId =
          "0x4636ec6eeb986b3c1f09931b3abfd166692d64d514b7ee9c1c356fb605cb6d8d";
        const tx = new TransactionBlock();
        let [coin] = tx.splitCoins(tx.gas, [tx.pure(betValue)]);
        tx.setGasBudget(10000000);
        tx.moveCall({
          target: `${packageId}::catchemAll::play_game`,
          typeArguments: [],
          arguments: [
            tx.object(catchemAllId),
            coin,
            tx.object(
              Inputs.SharedObjectRef({
                objectId: "0x6",
                initialSharedVersion: 1,
                mutable: false,
              })
            ),
          ],
        });

        const result = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: tx,
          options: {
            showEvents: true,
          },
        });
        if (result.events[0].parsedJson?.winning === "win") {
          setIsConfetti(true);
          setIsWin(true);
        } else {
          setIsWin(false);
        }

        //Storing Result to Database
        storeHistory(
          result.events[0].parsedJson?.sender,
          `${parseFloat(result.events[0].parsedJson?.profit) / 1000000000}`,
          `${parseFloat(result.events[0].parsedJson?.bet_amount) / 1000000000}`,
          {},
          result.events[0].parsedJson?.winning,
          "Catchem All"
        );

        setStatusGame("over");
      } else {
        toast.info("You don't have sufficient balance !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.toString().includes("Rejected from user")) {
        // nothing
      } else {
        toast.info("Something is wrong please try again !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  const getHistories = async (e) => {
    const resp = await getAllHistories('Catchem All', 10);
    setRecentlyPlay(resp);
    setisLoad(true);
  };

  useEffect(() => {
    setDomLoaded(true);
    getMinMax();
    getHistories();
  }, []);

  useEffect(() => {
    calculateBet();
  }, [MultipleBets, Wager]);

  useEffect(() => {
    configureMoment(locale);
  }, [locale]);

  useEffect(() => {
    if (!IsConfetti) return;

    const intervalId = setInterval(() => {
      setIsConfetti(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [IsConfetti]);

  if (isLoad) {
    return (
      <>
        {domLoaded && (
          <div className="px-4 lg:px-10 py-10 lg:py-24 lg:grid lg:grid-cols-5">
            {isTabletOrMobile && (
              <div className="pb-6">
                <h1 className="text-center text-4xl font-bold text-primary-800">
                  Catch'em All
                </h1>
                <h3 className="text-center text-2xl font-bold">{t('game_content.game')}</h3>
              </div>
            )}
            {isDesktop && (
              <div className="col-span-2 px-4">
                <div className="pb-6">
                  <h1 className="text-center text-4xl font-bold text-primary-800">
                    Catch'em All
                  </h1>
                  <h3 className="text-center text-2xl font-bold">{t('game_content.game')}</h3>
                </div>
                <h1
                  className="px-6 py-3 text-center text-lg font-bold rounded-t-lg"
                  style={{ backgroundColor: "#2F3030" }}
                >
                  {t('game_content.recently_play')}
                </h1>
                <div className="relative overflow-x-auto shadow-md rounded-b-lg">
                  <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                    <thead class="text-lg text-white" style={{ backgroundColor: "#2F3030" }}>
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.player')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.result')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.wager')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.profit')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.time')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {RecentlyPlay?.map((stat, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                          style={{ backgroundColor: "#262626" }}
                        >
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {stat.walletAddress.substr(0, 4) +
                              "....." +
                              stat.walletAddress.substr(
                                stat.walletAddress.length - 4,
                                stat.walletAddress.length
                              )}{" "}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {stat?.result.charAt(0).toUpperCase() + stat?.result.slice(1)}{" "}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            <div
                              className="flex items-center"
                            >
                              <img
                                width={25}
                                src="/images/sui_brand.png"
                                alt="Sui Brand"
                              />
                              {(Number(stat.wager)).toFixed(2)}
                            </div>
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap dark:text-white inline-flex"
                          >
                            {stat.result === "lose" ? (
                              <div
                                className="flex items-center"
                                style={{ color: "red" }}
                              >
                                <img
                                  width={25}
                                  src="/images/sui_brand.png"
                                  alt="Sui Brand"
                                />
                                -
                                {(Number(stat.wager)).toFixed(2)}
                              </div>
                            ) : (
                              <div
                                className="flex items-center"
                                style={{ color: "green" }}
                              >
                                <img
                                  width={25}
                                  src="/images/sui_brand.png"
                                  alt="Sui Brand"
                                />
                                +{(Number(stat.wager)).toFixed(2)}
                              </div>
                            )}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {moment(Number(stat.__createdtime__)).fromNow()}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="col-span-3 w-1/3 h-full w-full mr-4 h-60 bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] rounded-lg">
              {StatusGame === "ready" ? (
                <div className="lg:grid lg:grid-cols-5 justify-center h-full bg-[#2F3030] text-white p-4 rounded-lg">
                  <div className="col-span-2 xl:px-2 2xl:px-2 self-center">
                    <img
                      className="mx-auto catchem-img"
                      src="/images/catchem-chara.png"
                    />
                  </div>
                  <div className="col-span-3 lg:px-10 self-center">
                    <h1 className="text-center text-xl font-bold">
                      {t('game_content.set_your_bet')}
                    </h1>
                    <div className="2xl:px-14">
                      <div className="flow-root">
                        <div className="grid grid-cols-2">
                          <label className="block mb-2 text-sm font-medium text-white text-start">
                            {t('game_content.wager')}
                          </label>
                          <label className="block mb-2 text-sm font-medium text-white text-end">
                            Min {MinBet}
                          </label>
                        </div>
                        <input
                          value={Wager}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const sanitizedValue = inputValue.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            setWager(sanitizedValue);
                          }}
                          type="text"
                          className="bg-black border border-primary-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5"
                          placeholder=""
                        />
                        <button onClick={() => { setWager(MaxBet) }} className="block mb-2 text-sm font-bold text-primary-500 bg-primary-800 w-fit float-right p-1 rounded-md text-end mt-1.5">
                          {t('game_content.max')} {MaxBet}
                        </button>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-white">
                          {t('game_content.multiple_bets')}
                        </label>
                        <input
                          value={MultipleBets}
                          disabled
                          type="text"
                          className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5"
                          placeholder=""
                        />
                        <input
                          value={MultipleBets}
                          onChange={(e) => {
                            setMultipleBets(e.target.value);
                          }}
                          type="range"
                          min={1}
                          max={10}
                          step={1}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="mt-4 grid grid-cols-2 space-x-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-white">
                            {t('game_content.max_payout')}
                          </label>
                          <input
                            value={MaxPayout}
                            onChange={(e) => {
                              setMaxPayout(e.target.value);
                            }}
                            type="text"
                            disabled
                            className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-white text-end">
                            {t('game_content.total_wager')}
                          </label>
                          <input
                            value={TotalWager}
                            onChange={(e) => {
                              var value = Number(e.target.value).toFixed(2);
                              setTotalWager(value);
                            }}
                            type="text"
                            disabled
                            className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="mt-6 play-wrapper">
                        {wallet?.connected ? (
                          <>
                            {Number(TotalWager) <= Number(MaxBet) &&
                              Number(TotalWager) >= Number(MinBet) ? (
                              <button
                                onClick={playGame}
                                className="w-full py-2 bg-primary-800 rounded-lg text-black font-bold"
                              >
                                {t('game_content.play')}
                              </button>
                            ) : (
                              <button
                                disabled
                                className="w-full py-2 bg-gray-500 rounded-lg text-gray-300 text-sm font-bold"
                              >
                                {t('game_content.alert_bet')}
                              </button>
                            )}
                          </>
                        ) : (
                          <ConnectButton label="Connect Wallet" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="justify-center h-full bg-[#2F3030] text-white p-4 rounded-lg grid">
                  <div className="lg:px-10 self-center">
                    <div className="2xl:px-14">
                      {IsWin ? (
                        <div className="text-center">
                          <label className="block mb-2 text-5xl font-bold text-white">
                            {t('game_content.win')}
                          </label>
                          <label
                            className="block mb-2 text-3xl font-medium"
                            style={{ color: "green" }}
                          >
                            +{MaxPayout}
                          </label>
                          <img
                            className="mx-auto"
                            style={{ width: "15em" }}
                            src="/images/catchem-chara.png"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <label className="block mb-2 text-5xl font-bold text-white">
                            {t('game_content.lose')}
                          </label>
                          <label
                            className="block mb-2 text-3xl font-medium"
                            style={{ color: "red" }}
                          >
                            -{TotalWager}
                          </label>
                          <img
                            className="mx-auto"
                            style={{ width: "15em" }}
                            src="/images/catchem-chara.png"
                          />
                        </div>
                      )}
                      <div className="mt-6 play-wrapper text-center">
                        <button
                          onClick={() => {
                            setStatusGame("ready");
                            getHistories();
                          }}
                          className="w-full py-2 bg-primary-800 rounded-lg text-black font-bold"
                        >
                          {t('game_content.try_again')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isTabletOrMobile && (
              <div className="col-span- mt-6">
                <h1
                  className="px-6 py-3 text-center text-lg font-bold rounded-t-lg"
                  style={{ backgroundColor: "#2F3030" }}
                >
                  {t('game_content.recently_play')}
                </h1>
                <div className="relative overflow-x-auto shadow-md rounded-b-lg">
                  <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                    <thead class="text-lg text-white" style={{ backgroundColor: "#2F3030" }}>
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.player')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.result')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.wager')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.profit')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {t('game_content.time')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {RecentlyPlay?.map((stat, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                          style={{ backgroundColor: "#262626" }}
                        >
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {stat.walletAddress.substr(0, 4) +
                              "....." +
                              stat.walletAddress.substr(
                                stat.walletAddress.length - 4,
                                stat.walletAddress.length
                              )}{" "}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {stat?.result.charAt(0).toUpperCase() + stat?.result.slice(1)}{" "}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            <div
                              className="flex items-center"
                            >
                              <img
                                width={25}
                                src="/images/sui_brand.png"
                                alt="Sui Brand"
                              />
                              {(Number(stat.wager)).toFixed(2)}
                            </div>
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap dark:text-white inline-flex"
                          >
                            {stat.result === "lose" ? (
                              <div
                                className="flex items-center"
                                style={{ color: "red" }}
                              >
                                <img
                                  width={25}
                                  src="/images/sui_brand.png"
                                  alt="Sui Brand"
                                />
                                -
                                {(Number(stat.wager)).toFixed(2)}
                              </div>
                            ) : (
                              <div
                                className="flex items-center"
                                style={{ color: "green" }}
                              >
                                <img
                                  width={25}
                                  src="/images/sui_brand.png"
                                  alt="Sui Brand"
                                />
                                +{(Number(stat.wager)).toFixed(2)}
                              </div>
                            )}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {moment(Number(stat.__createdtime__)).fromNow()}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div>
              <ToastContainer
                toastClassName={({ type }) =>
                  contextClass[type || "default"] +
                  " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer font-bold w-max"
                }
              />
            </div>
            {IsConfetti && <Confetti />}
          </div>
        )}

        <Footer />
      </>
    );
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
