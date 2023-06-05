import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import { useWallet } from "@suiet/wallet-kit";
import {
  getPlayerHistories,
  getAllLevels,
  updateUsernameData,
} from "./api/db_services";
import LoadingSpinner from "../components/Spinner";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { AppContext } from "../utils/AppContext";

export function configureMoment(langauge) {
  moment.locale(langauge);
}

export default function profile() {
  const { t } = useTranslation("global");
  const { locale } = useRouter();
  const wallet = useWallet();
  const [playerHistories, setPlayerHistories] = useState([]);
  const [levelThresholds, setLevelThresholds] = useState([]);
  const [playerCurrentLevel, setPlayerCurrentLevel] = useState();
  const [playerNextLevel, setPlayerNextLevel] = useState();
  const [progressPercentage, setProgressPercentage] = useState();
  const [isLoad, setisLoad] = useState();
  const [editingMode, setEditingMode] = useState(false);
  const { state, setUserData } = useContext(AppContext);
  const { userData } = state;
  const [inputData, setInputData] = useState("");

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputData) {
      console.log("Input field has data:", inputData);
      // Perform further actions with the input data
      var resp = await updateUsernameData(userData.walletAddress, inputData);
      setUserData(resp);

      setEditingMode(!editingMode);
    } else {
      console.log("Input field is empty, change username cancelled");
      setEditingMode(!editingMode);
    }
  };

  const getHistories = async (e) => {
    const resp = await getPlayerHistories(wallet.address, 10);
    const levels = await getAllLevels();
    setPlayerHistories(resp);
    //For Testing Only
    setLevelThresholds(levels);
    getLevelProgressBar(levels, resp.totalWager);
    //For Testing Only
    // getLevelProgressBar(levels, 4100);
    setisLoad(true);
  };

  useEffect(() => {
    if (wallet?.connected) {
      console.log("connected");
      getHistories();
    }
  }, [wallet]);

  //   useEffect(() => {
  //     setPlayerCurrentLevel(calculateLevel(4900));
  //   }, [totalWager]);

  useEffect(() => {
    configureMoment(locale);
  }, [locale]);

  const calculateLevel = (userExp, levelThresholds) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (userExp >= levelThresholds[i].threshold) {
        return levelThresholds[i];
      }
    }

    return levelThresholds[0]; // Default level if no threshold is met
  };

  const getLevelProgressBar = (levelThresholds, totalWgr) => {
    const calculatedLevel = calculateLevel(totalWgr, levelThresholds);
    //For Testing only
    // const calculatedLevel = calculateLevel(4100, levelThresholds);
    setPlayerCurrentLevel(calculatedLevel);

    const i = levelThresholds.findIndex(
      (item) => item.levelName === calculatedLevel.levelName
    );

    if (i !== levelThresholds.length - 1) {
      setPlayerNextLevel(levelThresholds[i + 1]);

      setProgressPercentage(
        (totalWgr / levelThresholds[i + 1].threshold) * 100
      );
    } else {
      setPlayerNextLevel(levelThresholds[i]);

      setProgressPercentage(100);
    }
  };

  if (isLoad) {
    return (
      <>
        <div class="p-4 lg:p-16">
          <div class="rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] mt-24">
            <div className="flex flex-col justify-center text-center h-full bg-[#2F3030] text-white rounded-[10px] p-4">
              <div class="grid grid-cols-1 md:grid-cols-3">
                <div class="grid grid-cols-3 text-center order-last md:order-first mt-4 md:mt-0 gap-2 md:gap-4">
                  <div
                    className="py-4 rounded-lg"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div className="flex justify-center items-center">
                      <p class="font-bold text-white text-xl pl-4">
                        {playerHistories.totalWager.toFixed(2)}
                      </p>
                      <img src="/images/sui_brand.png" alt="Sui Brand" />
                    </div>
                    <p class="text-gray-400">{t("profile_content.wagered")}</p>
                  </div>
                  <div
                    className="py-4 rounded-lg"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div className="flex justify-center items-center">
                      <p class="font-bold text-white text-xl pl-4">
                        {!playerHistories.biggestWager ||
                        playerHistories.biggestWager === -Infinity
                          ? "0.00"
                          : playerHistories.biggestWager.toFixed(2)}
                      </p>
                      <img src="/images/sui_brand.png" alt="Sui Brand" />
                    </div>
                    <p class="text-gray-400">
                      {t("profile_content.biggest_bet")}
                    </p>
                  </div>
                  <div
                    className="py-4 rounded-lg flex justify-center items-center"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div>
                      <p class="font-bold text-white text-xl">
                        {playerHistories.count ? playerHistories.count : "0"}
                      </p>
                      <p class="text-gray-400">{t("profile_content.bets")}</p>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div class="w-48 h-48 bg-gray-400 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-white">
                    <img
                      className="rounded-full"
                      src={
                        playerCurrentLevel
                          ? playerCurrentLevel.image
                          : "/images/badges/bronze-1.png"
                      }
                      alt="badges"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-3 text-center justify-between mt-32 md:mt-0 md:justify-center gap-2 md:gap-4">
                  <div
                    className="py-4 rounded-lg flex justify-center items-center"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div>
                      <div className="flex justify-center items-center">
                        <p class="font-bold text-xl pl-4 text-green-500">
                          +
                          {!playerHistories.totalProfit
                            ? "0.00"
                            : playerHistories.totalProfit.toFixed(2)}
                        </p>
                        <img src="/images/sui_brand.png" alt="Sui Brand" />
                      </div>
                      <p class="text-gray-400">
                        {t("profile_content.profit")} +
                      </p>
                    </div>
                  </div>
                  <div
                    className="py-4 rounded-lg flex justify-center items-center"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div>
                      <p class="font-bold text-white text-xl">
                        {playerHistories.wins ? playerHistories.wins : "0"}
                      </p>
                      <p class="text-gray-400">{t("profile_content.wins")}</p>
                    </div>
                  </div>
                  <div
                    className="py-4 rounded-lg flex justify-center items-center"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div>
                      <p class="font-bold text-white text-xl px-2">
                        {playerHistories.mostFavoriteGame
                          ? playerHistories.mostFavoriteGame
                          : "-"}
                      </p>
                      <p class="text-gray-400">
                        {t("profile_content.favorite_game")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-10 md:mt-20 text-center border-b border-[#8b8b8b] pb-12">
                <h1 class="text-4xl font-medium text-white">
                  {userData.walletAddress.substr(0, 4) +
                    "....." +
                    userData.walletAddress.substr(
                      userData.walletAddress.length - 4,
                      userData.walletAddress.length
                    )}{" "}
                </h1>
                <div className="flex items-center justify-center space-x-2">
                  {!editingMode ? (
                    <p
                      className="text-2xl font-light"
                      style={{ color: `${"#" + playerCurrentLevel.colorHex}` }}
                    >
                      {userData?.username == null ? "-" : userData.username}
                    </p>
                  ) : (
                    <input
                      type="text"
                      id="username"
                      value={inputData}
                      onChange={handleInputChange}
                      class="bg-transparent w-fit border-b-2 border-gray-600 text-gray-100 text-sm focus:border-gray-400 focus:outline-none block p-1.5"
                      placeholder=""
                    />
                  )}

                  <button
                    className="bg-gray-600 rounded-full p-1"
                    onClick={
                      editingMode === true
                        ? handleSubmit
                        : () => {
                            setEditingMode(!editingMode);
                          }
                    }
                  >
                    {editingMode ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-check"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-3"
                      >
                        <path d="M12 20h9" fill="white"></path>
                        <path
                          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                          fill="white"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
                <p
                  class="font-medium text-2xl text-white mt-3"
                  style={{
                    color: `#${
                      playerCurrentLevel
                        ? playerCurrentLevel.colorHex
                        : "FFFFFF"
                    }`,
                  }}
                >
                  {playerCurrentLevel ? playerCurrentLevel.levelName : "-"}
                </p>

                <div className="w-full h-6 mb-4 bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
                  <div
                    className="h-6 rounded-full dark:bg-blue-500 text-center"
                    style={{
                      width: `${progressPercentage ? progressPercentage : 0}%`,
                      backgroundColor: `#${
                        playerCurrentLevel
                          ? playerCurrentLevel.colorHex
                          : "FFFFFF"
                      }`,
                    }}
                  >{`${
                    progressPercentage ? progressPercentage.toFixed(2) : 0
                  }%`}</div>
                  <div className="grid grid-cols-2 mt-2">
                    <div className="text-start">
                      <p
                        className="text-base font-medium"
                        style={{
                          color: `#${
                            playerCurrentLevel
                              ? playerCurrentLevel.colorHex
                              : "FFFFFF"
                          }`,
                        }}
                      >
                        {playerCurrentLevel
                          ? playerCurrentLevel.levelName
                          : "-"}
                      </p>
                      <p className="text-xs font-light">
                        {playerHistories.totalWager
                          ? playerHistories.totalWager.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                    <div className="text-end">
                      <p
                        className="text-base font-medium"
                        style={{
                          color: `#${
                            playerNextLevel
                              ? playerNextLevel.colorHex
                              : "FFFFFF"
                          }`,
                        }}
                      >
                        {playerCurrentLevel.levelName ===
                        playerNextLevel.levelName
                          ? t("profile_content.max_level")
                          : playerNextLevel
                          ? playerNextLevel.levelName
                          : "-"}
                      </p>
                      <p className="text-xs font-light">
                        {playerCurrentLevel.levelName ===
                        playerNextLevel.levelName
                          ? t("profile_content.max_level_reached")
                          : playerNextLevel
                          ? playerNextLevel.threshold.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="mt-16 w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                    <thead
                      className="text-xs text-white text-white tracking-widest"
                      style={{ backgroundColor: "#404040" }}
                    >
                      <tr className="text-lg 2xl:text-xl">
                        <th scope="col" className="px-6 py-3">
                          {t("profile_content.game")}
                        </th>
                        <th scope="col" className="px-6 py-3">
                          {t("profile_content.time")}
                        </th>
                        <th scope="col" className="px-6 py-3">
                          {t("profile_content.player")}
                        </th>
                        <th scope="col" className="px-6 py-3">
                          {t("profile_content.wager")}
                        </th>
                        <th scope="col" className="px-6 py-3">
                          {t("profile_content.profit")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerHistories.records.map((stat, index) => (
                        <tr
                          class="border-b border-[#2F3030] 2xl:text-lg dark:border-[#2F3030]"
                          style={{ backgroundColor: "#262626" }}
                        >
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-white"
                          >
                            {stat.gameName}
                          </th>
                          <td class="px-6 py-4 text-white">
                            {moment(Date.parse(stat.createdAt)).fromNow()}
                          </td>
                          {stat.username !== null ? (
                            <td
                              scope="row"
                              className="px-6 py-4 truncate"
                              style={{
                                color: "#" + stat?.playerLv?.hex,
                                maxWidth: "1px",
                              }}
                            >
                              {stat.username}
                            </td>
                          ) : (
                            <td
                              scope="row"
                              className="px-6 py-4"
                              style={{ color: "#" + stat?.playerLv?.hex }}
                            >
                              {stat.walletAddress.substr(0, 4) +
                                "....." +
                                stat.walletAddress.substr(
                                  stat.walletAddress.length - 4,
                                  stat.walletAddress.length
                                )}{" "}
                            </td>
                          )}
                          <td class="px-6 py-4 text-white">
                            <div className="flex items-center">
                              {stat.wager}
                              <img
                                src="/images/sui_brand.png"
                                alt="Sui Brand"
                              />
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
                    <p className="text-2xl font-medium">
                      {t("profile_content.buy_nft")}
                    </p>

                    <div className="flex flex-col items-center justify-center px-16 mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row sm:px-0">
                      <a
                        href="#"
                        title=""
                        className="className='w-full py-4 px-10 bg-primary-800 rounded-lg text-black font-bold"
                        role="button"
                      >
                        {" "}
                        {t("profile_content.shop_now")}{" "}
                      </a>
                    </div>

                    <p className="mt-6 text-base text-gray-300">
                      {t("profile_content.visit_website")}?{" "}
                      <a
                        href="#"
                        title=""
                        className="text-primary-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
                      >
                        {t("profile_content.here")}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoadingSpinner />;
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["global"])),
    },
  };
}
