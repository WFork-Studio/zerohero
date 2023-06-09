import LoadingSpinner from "../../components/Spinner";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../utils/AppContext";
import { useWallet, useAccountBalance, ConnectButton } from "@suiet/wallet-kit";
import {
  JsonRpcProvider,
  testnetConnection,
  TransactionBlock,
  Inputs
} from "@mysten/sui.js";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-confetti";
import { storeHistory, getAllHistories } from "../api/db_services";
import moment from "moment";
import Footer from "../../components/Footer";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from "next/router";
import 'moment/locale/de';
import 'moment/locale/es';
import { getStaticPaths, makeStaticProps } from '../../lib/getStatic'
import i18nextConfig from '../../next-i18next.config'
import { Tooltip } from 'react-tooltip'
const provider = new JsonRpcProvider(testnetConnection);

export function configureMoment(langauge) {
  moment.locale(langauge);
}

export default function CatchemAll(statsDatas) {
  const { t } = useTranslation('common');
  const { locale, query } = useRouter();
  const currentLocale = query.locale || i18nextConfig.i18n.defaultLocale
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
  const [IsLoadResult, setIsLoadResult] = useState(false);
  const [StatusGame, setStatusGame] = useState("ready");
  const [IsWin, setIsWin] = useState(false);
  const { state, setUserData } = useContext(AppContext);
  const { userData, playerCurrentLevel } = state;
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
      id: "0x6a2400b8affd446efa005397dc2d1ec2fcb2a759c738698a6c354b51f82aa321",
      // fetch the object content field
      options: { showContent: true },
    });

    console.log(txn?.data?.content?.fields);
    var minBet = txn?.data?.content?.fields?.min_bet / 1000000000;
    setMinBet(minBet);

    let bank = Number(txn?.data?.content?.fields?.bank) / 1000000000;
    let max = (bank * txn?.data?.content?.fields?.max_bet) / 10000;
    setMaxBet(Number(max));
  };

  const playGame = async (e) => {
    var wager = Number(TotalWager) * 1000000000;
    try {
      if (Number(walletBalance) > wager) {
        const betValue = Number(TotalWager) * 1000000000;

        const packageId =
          "0xe72d80fbb6af68fad13b05ea07f5002b4335d29ecedcf752860b36fac951a00e";
        const catchemAllId =
          "0x6a2400b8affd446efa005397dc2d1ec2fcb2a759c738698a6c354b51f82aa321";
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

        setIsLoadResult(true);
        setTimeout(async function () {

          if (result.events[0].parsedJson?.winning === "win") {
            setIsConfetti(true);
            setIsWin(true);
          } else {
            setIsWin(false);
          }

          var profit;
          var payout;
          if (result.events[0].parsedJson?.winning === 'win') {
            var wager = parseFloat(result.events[0].parsedJson?.bet_amount) / 1000000000;
            var percentage = 5;
            profit = wager - (wager * (percentage / 100))
            payout = wager * 2;
          } else if (result.events[0].parsedJson?.winning === 'lose') {
            profit = parseFloat(result.events[0].parsedJson?.bet_amount) / 1000000000;
            payout = 0;
          }

          //Storing Result to Database
          await storeHistory(
            result.events[0].parsedJson?.sender,
            profit, //profit
            payout, //payout
            `${parseFloat(result.events[0].parsedJson?.bet_amount) / 1000000000}`, //wager
            {},
            result.events[0].parsedJson?.winning,
            "Catchem All",
            {
              level: playerCurrentLevel.levelName,
              hex: playerCurrentLevel.colorHex,
              image: playerCurrentLevel.image
            },
            userData?.username
          );

          setIsLoadResult(false);
          setStatusGame("over");
        }, 4000);
      } else {
        toast.info("You don't have sufficient balance !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      setIsLoadResult(false);
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
    setRecentlyPlay(resp.records);
    setisLoad(true);
  };

  useEffect(() => {
    setDomLoaded(true);
    getMinMax();
    getHistories();
  }, []);

  useEffect(() => {
    if (StatusGame === 'over') {
      getHistories();
    }
  }, [StatusGame]);

  useEffect(() => {
    calculateBet();
  }, [MultipleBets, Wager]);

  useEffect(() => {
    configureMoment(currentLocale);
  }, [currentLocale]);

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
                <h3 className="text-center text-2xl font-bold text-white">{t('game_content.game')}</h3>
              </div>
            )}
            {isDesktop && (
              <div className="col-span-2 px-4">
                <div className="pb-6">
                  <h1 className="text-center text-4xl font-bold text-primary-800">
                    Catch'em All
                  </h1>
                  <h3 className="text-center text-2xl font-bold text-white">{t('game_content.game')}</h3>
                </div>
                <h1
                  className="px-6 py-3 text-center text-lg font-bold rounded-t-lg text-white"
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
                        <th scope="col" className="px-6 py-3">
                          {t("game_content.payout")}
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
                          className="border-b border-[#2F3030] dark:border-[#2F3030]"
                          style={{ backgroundColor: "#262626" }}
                        >
                          {stat.username !== null ? (
                            <th
                              scope="row"
                              className="px-6 text-center"
                            >
                              <div className="flex items-center">
                                <img className="w-5 h-5 rounded-full mr-2" src={stat?.playerLv?.image} alt="Sui Brand" />
                                <div className="font-medium whitespace-nowrap text-start" style={{
                                  color: "#" + stat?.playerLv?.hex,
                                  maxWidth: "15em",
                                }}>
                                  <p className="truncate" style={{ color: "#" + stat?.playerLv?.hex }}>{stat.username}</p>
                                </div>
                              </div>
                            </th>
                          ) : (
                            <th
                              scope="row"
                              className="px-6 py-2 font-medium whitespace-nowrap text-start"
                              style={{ color: "#" + stat?.playerLv?.hex }}
                            >
                              <div className="flex items-center">
                                <img className="w-5 h-5 rounded-full mr-2" src={stat?.playerLv?.image} alt="Sui Brand" />
                                <p>
                                  {stat.walletAddress.substr(0, 4) +
                                    "....." +
                                    stat.walletAddress.substr(
                                      stat.walletAddress.length - 4,
                                      stat.walletAddress.length
                                    )}{" "}
                                </p>
                              </div>
                            </th>
                          )}
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
                              {stat.wager}
                            </div>
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
                              {(Number(stat.payout)).toFixed(2)}
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
                                {stat.profit}
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
                                +{stat.profit}
                              </div>
                            )}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {moment(stat.createdAt).fromNow()}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {IsLoadResult ?
              <div className="col-span-3 w-1/3 h-full w-full mr-4 h-60 bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] rounded-lg">
                <div className="flex items-center justify-center h-full bg-[#2F3030] text-white p-4 rounded-lg">
                  <div className="text-center">
                    <div className="md:w-3/6 mx-auto">
                      <img className="mx-auto rounded-lg" src="/images/ca-loading.gif" />
                    </div>
                    <div class="md:w-3/6 mx-auto bg-gray-300 h-2 rounded-full relative mt-2">
                      <div class="h-full bg-gradient-to-r from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] rounded-full absolute animate-loading-bar"></div>
                    </div>
                  </div>
                </div>
              </div>
              :
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
                          <div className="flex">
                            <label className="block mb-2 text-sm font-medium text-white">
                              {t('game_content.multiple_bets')}
                            </label>
                            <div className="ml-2">
                              <a id="clickable" className="bg-white rounded-full text-black px-2 font-medium">
                                ὶ
                              </a>
                              <Tooltip anchorSelect="#clickable">
                                <button>The number of bets you want to wager in one transaction.</button>
                              </Tooltip>
                            </div>
                          </div>
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
                            <label className="block mb-2 text-4xl font-bold text-white">
                              {t('game_content.win')}
                            </label>
                            <label
                              className="block mb-2 text-3xl font-medium"
                              style={{ color: "green" }}
                            >
                              +{MaxPayout}
                            </label>
                            <img
                              className="mx-auto rounded-lg"
                              style={{ width: "20em" }}
                              src="/images/ca-win.gif"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <label className="block mb-2 text-4xl font-bold text-white">
                              {t('game_content.lose')}
                            </label>
                            <label
                              className="block mb-2 text-3xl font-medium"
                              style={{ color: "red" }}
                            >
                              -{TotalWager}
                            </label>
                            <img
                              className="mx-auto rounded-lg"
                              style={{ width: "20em" }}
                              src="/images/ca-lose.gif"
                            />
                          </div>
                        )}
                        <div className="mt-6 play-wrapper text-center">
                          <button
                            onClick={() => {
                              setStatusGame("ready");
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
            }
            {isTabletOrMobile && (
              <div className="col-span- mt-6">
                <h1
                  className="px-6 py-3 text-center text-lg font-bold rounded-t-lg text-white"
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
                        <th scope="col" className="px-6 py-3">
                          {t("game_content.payout")}
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
                          className="border-b border-[#2F3030] dark:border-[#2F3030]"
                          style={{ backgroundColor: "#262626" }}
                        >
                          {stat.username !== null ? (
                            <th
                              scope="row"
                              className="px-6 text-center"
                            >
                              <div className="flex items-center">
                                <img className="w-5 h-5 rounded-full mr-2" src={stat?.playerLv?.image} alt="Sui Brand" />
                                <div className="font-medium whitespace-nowrap text-start" style={{
                                  color: "#" + stat?.playerLv?.hex,
                                  maxWidth: "15em",
                                }}>
                                  <p className="truncate" style={{ color: "#" + stat?.playerLv?.hex }}>{stat.username}</p>
                                </div>
                              </div>
                            </th>
                          ) : (
                            <th
                              scope="row"
                              className="px-6 py-2 font-medium whitespace-nowrap text-start"
                              style={{ color: "#" + stat?.playerLv?.hex }}
                            >
                              <div className="flex items-center">
                                <img className="w-5 h-5 rounded-full mr-2" src={stat?.playerLv?.image} alt="Sui Brand" />
                                <p>
                                  {stat.walletAddress.substr(0, 4) +
                                    "....." +
                                    stat.walletAddress.substr(
                                      stat.walletAddress.length - 4,
                                      stat.walletAddress.length
                                    )}{" "}
                                </p>
                              </div>
                            </th>
                          )}
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
                              {stat.wager}
                            </div>
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
                              {(Number(stat.payout)).toFixed(2)}
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
                                {stat.profit}
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
                                +{stat.profit}
                              </div>
                            )}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium whitespace-nowrap text-start dark:text-white"
                          >
                            {moment(stat.createdAt).fromNow()}
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

const getStaticProps = makeStaticProps(['common'])
export { getStaticPaths, getStaticProps }

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common']))
//     }
//   };
// }
