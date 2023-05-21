import styles from "../styles/Home.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import MediaQuery from "react-responsive";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllHistories,
  getAllHistoriesCount,
  getAllHistoriesTotalWager,
} from "./api/db_services";
import moment from "moment/moment";

export default function Home() {
  const [domLoaded, setDomLoaded] = useState(false);

  const [isLoad, setisLoad] = useState();
  const [allHistories, setAllHistories] = useState([]);
  const [countHistories, setCountHistories] = useState([]);
  const [totalWager, setTotalWager] = useState([]);
  const getHistories = async (e) => {
    const resp = await getAllHistories(null, 3);
    const count = await getAllHistoriesCount();
    const wager = await getAllHistoriesTotalWager();

    setCountHistories(count);
    setAllHistories(resp);
    setTotalWager(wager);
    setisLoad(true);
  };

  useState(() => {
    getHistories();
  }, []);

  const images = [
    { url: "images/nft1.JPG" },
    { url: "images/nft2.JPG" },
    { url: "images/nft3.JPG" },
  ];

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  if (isLoad)
    return (
      <>
        {domLoaded && (
          <section className="font-coolvetica pb-7">
            <div className={styles.container}>
              <div className="md:flex items-center pt-3 justify-between">
                <div className="row-span-3 text-white text-6xl md:text-7xl 2xl:text-8xl py-6 md:py-20">
                  <div className="col-span-3">Work is overrated</div>
                  <span className="row-span-3 col-span-3">Retire early at</span>
                  <span
                    className="row-span-3 col-span-3"
                    style={{ color: "#00F0FF" }}
                  >
                    &nbsp;ZeroHero
                  </span>
                </div>
                <div className="md:w-1/2 h-max grid grid-cols-1">
                  <div className="shadow-lg w-full">
                    <MediaQuery maxWidth={767.9}>
                      <div>
                        <div className="text-3xl text-white p-3 items-center justify-center md:pt-10">
                          {/* Slider will be here */}

                          <Carousel
                            showThumbs={false}
                            showArrows={false}
                            infiniteLoop={true}
                            dynamicHeight={true}
                            autoPlay={true}
                            interval={3000}
                          >
                            <div>
                              <img
                                className="rounded-xl"
                                src="images/nft1.JPG"
                              />
                            </div>
                            <div>
                              <img
                                className="rounded-xl"
                                src="images/nft2.JPG"
                              />
                            </div>
                            <div>
                              <img
                                className="rounded-xl"
                                src="images/nft3.JPG"
                              />
                            </div>
                          </Carousel>
                        </div>
                        <div className="flex mb-4">
                          <div className="w-full">
                            <h2 className="text-xl">
                              Buy ZeroHero NFTs on the market now!
                            </h2>
                          </div>
                          <div>
                            <button
                              className="w-full py-4 px-4 md:px-10 bg-primary-800 rounded-lg text-black font-bold"
                              style={{ minWidth: "max-content" }}
                            >
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </MediaQuery>

                    <MediaQuery minWidth={768} maxWidth={991.9}>
                      <div>
                        <div className="text-3xl text-white p-3 items-center justify-center md:pt-10">
                          {/* Slider will be here */}

                          <Carousel
                            showThumbs={false}
                            showArrows={false}
                            infiniteLoop={true}
                            dynamicHeight={true}
                            autoPlay={true}
                            interval={3000}
                          >
                            <div>
                              <img
                                className="rounded-xl"
                                src="images/nft1.JPG"
                              />
                            </div>
                            <div>
                              <img
                                className="rounded-xl"
                                src="images/nft2.JPG"
                              />
                            </div>
                            <div>
                              <img
                                className="rounded-xl"
                                src="images/nft3.JPG"
                              />
                            </div>
                          </Carousel>
                        </div>
                        <div className="mb-4">
                          <div className="w-full mb-2">
                            <h2 className="text-xl">
                              Buy ZeroHero NFTs on the market now!
                            </h2>
                          </div>
                          <div>
                            <button
                              className="w-full py-4 px-10 bg-primary-800 rounded-lg text-black font-bold"
                              style={{ minWidth: "max-content" }}
                            >
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </MediaQuery>

                    <MediaQuery minWidth={992}>
                      <div className="flex flex-auto">
                        <div className="flex-grow text-3xl text-white w-full p-3 items-center justify-center pt-10">
                          {/* Slider will be here */}

                          <Carousel
                            showThumbs={false}
                            showArrows={false}
                            infiniteLoop={true}
                            dynamicHeight={true}
                            autoPlay={true}
                            interval={3000}
                          >
                            <div>
                              <img
                                className="rounded-xl lg:h-[5em] xl:h-[7em] 2xl:h-[10.5em] object-cover"
                                src="images/nft1.JPG"
                              />
                            </div>
                            <div>
                              <img
                                className="rounded-xl lg:h-[5em] xl:h-[7em] 2xl:h-[10.5em] object-cover"
                                src="images/nft2.JPG"
                              />
                            </div>
                            <div>
                              <img
                                className="rounded-xl lg:h-[5em] xl:h-[7em] 2xl:h-[10.5em] object-cover"
                                src="images/nft3.JPG"
                              />
                            </div>
                          </Carousel>
                        </div>
                        <div className="flex-grow w-full">
                          {/* <img
                          className="pt-10 w-full"
                          style={{ float: "right" }}
                          src="/images/buynow.png"
                          alt="Buy Now"
                        /> */}

                          <div className="relative w-full lg:h-[220px] 2xl:h-80">
                            <div className="absolute bg-gradient-to-r p-[4px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] w-full lg:h-[220px] 2xl:h-80 mt-10 [clip-path:polygon(0_0,65%_0,71%_18%,100%_18%,100%_100%,0_100%)]">
                              <div
                                className="flex flex-col w-full h-full bg-[#2f3030] p-3 items-center justify-center [clip-path:polygon(0_0,65%_0,71%_18%,100%_18%,100%_100%,0_100%)]"
                                style={{ alignItems: "self-start" }}
                              >
                                <h2 className="mt-2 lg:text-xl xl:text-2xl 2xl:text-5xl">
                                  Buy ZeroHero NFTs on the market now!
                                </h2>
                                <button
                                  className="mt-2 w-1/3 py-4 px-10 bg-primary-800 rounded-lg text-black font-bold"
                                  style={{ minWidth: "max-content" }}
                                >
                                  Shop Now
                                </button>
                              </div>
                            </div>

                            <div className="absolute bg-gradient-to-r p-[4px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] w-full right-0 top-0 lg:h-[220px] mt-10 2xl:h-80 [clip-path:polygon(67%_0,100%_0,100%_15%,72%_15%)]">
                              {/* <div className="flex w-full h-full bg-[#2f3030] [clip-path:polygon(67%_0,100%_0,100%_15%,72%_15%)]"></div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </MediaQuery>
                  </div>
                  <div className="flex pt-2 pb-2 justify-end items-end">
                    <div className="relative overflow-x-auto shadow-md rounded-lg w-[250px] mr-2">
                      <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                        <thead
                          className="text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                          style={{ backgroundColor: "#2F3030" }}
                        >
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-1 text-sm lg:text-lg"
                              style={{ color: "#00F0FF" }}
                            >
                              Total
                              <br />
                              Wagered
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            className="text-white text-center"
                            style={{ backgroundColor: "#262626" }}
                          >
                            <th
                              scope="row"
                              className="text-xl lg:text-3xl lg:px-6 py-2 pb-2 font-medium whitespace-nowrap dark:text-white"
                            >
                              {totalWager[0].totalWager.toFixed(2)}
                              <br />
                              {/* <div className="text-[#8C8888] text-sm">
                                Gamble sum: 30,219
                              </div> */}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="relative overflow-x-auto shadow-md rounded-lg w-[250px]">
                      <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                        <thead
                          className="text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                          style={{ backgroundColor: "#2F3030" }}
                        >
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-1 text-sm lg:text-lg"
                              style={{ color: "#00F0FF" }}
                            >
                              Total
                              <br />
                              Bets
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            className="text-white text-center"
                            style={{ backgroundColor: "#262626" }}
                          >
                            <th
                              scope="row"
                              className="text-xl lg:text-3xl lg:px-6 py-2 pb-2 font-medium whitespace-nowrap dark:text-white"
                            >
                              {countHistories[0].numberOfHistories}
                              <br />
                              {/* <div className="text-[#8C8888] text-sm">
                                Gamble sum: 30,219
                              </div> */}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative overflow-x-auto shadow-md rounded-t-lg">
                <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                  <thead
                    className="text-xs text-white dark:text-white tracking-widest"
                    style={{ backgroundColor: "#2F3030" }}
                  >
                    <tr className="text-lg 2xl:text-2xl">
                      <th scope="col" className="px-6 py-3">
                        Game
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Player
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Wager
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHistories.map((stat, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#2F3030] 2xl:text-lg dark:border-[#2F3030] text-white"
                        style={{ backgroundColor: "#262626" }}
                      >
                        <th
                          scope="row"
                          className="px-6 font-medium whitespace-nowrap dark:text-white"
                        >
                          {stat.gameName}
                        </th>
                        <td className="px-6">
                          {moment(Number(stat.__createdtime__)).fromNow()}
                        </td>
                        <td className="px-6 text-center">
                          {stat.walletAddress}
                        </td>
                        <td className="px-6">
                          <div className="flex items-center justify-center">
                            <img src="/images/sui_brand.png" alt="Sui Brand" />
                            {stat.wager}
                          </div>
                        </td>
                        {stat.profit == 0 ? (
                          <td className="px-6 py-1 text-red-500">
                            <div className="flex items-center justify-center">
                              <img
                                src="/images/sui_brand.png"
                                alt="Sui Brand"
                              />
                              -{stat.wager}
                            </div>
                          </td>
                        ) : (
                          <td className="px-6 py-1 text-green-500">
                            <div className="flex items-center justify-center">
                              <img
                                src="/images/sui_brand.png"
                                alt="Sui Brand"
                              />
                              +{stat.profit}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex items-center justify-between p-2 rounded-b-lg"
                style={{ backgroundColor: "#2F3030" }}
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-white dark:text-gray-400 pl-2">
                  Showing{" "}
                  <span className="font-semibold text-white dark:text-white">
                    3
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white dark:text-white">
                    {countHistories[0].numberOfHistories}
                  </span>{" "}
                  statistics data
                </span>
                <Link
                  className="inline-flex items-center -space-x-px text-white pr-2"
                  href="/statistics"
                >
                  Show more
                </Link>
              </nav>
              <div className="pt-8 lg:pt-12 2xl:pt-20 font-coolvetica text-2xl 2xl:text-3xl text-white">
                Game List
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 items-center pt-3 gap-2">
                <Link href="/coin-flip">
                  <img
                    className="md:pr-5 w-full my-2 md:my-0"
                    src="/images/flipcoin.png"
                    alt="Flip Coin"
                  />
                </Link>

                <Link href="/catchem-all">
                  <img
                    className="md:pr-5 w-full my-2 md:my-0"
                    src="/images/catchemall.png"
                    alt="Catch'em All"
                  />
                </Link>
                <img
                  className="md:pr-5 w-full my-2 md:my-0"
                  src="/images/dice.png"
                  alt="Dice"
                />
                <img
                  className="md:pr-5 w-full my-2 md:my-0"
                  src="/images/rps.png"
                  alt="Rock Paper Scissors"
                />
              </div>
              <div className="pt-8 pb-8 lg:pt-12 2xl:pt-20 lg:pb-12 2xl:pb-18 font-coolvetica text-2xl 2xl:text-3xl text-white overflow-auto">
                <div className="md:flex items-center pt-3 justify-between space-y-4 md:space-y-0">
                  <div className="md:w-1/3 md:mr-4 h-60 rounded-tr-[100px] rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB]">
                    <div className="flex flex-col justify-center h-full bg-[#2F3030] text-white rounded-tr-[100px] rounded-[10px] p-4">
                      <div className="text-xl lg:text-3xl text-white">
                        Provably fair betting
                      </div>
                      <div className="text-base lg:text-xl text-[#808080]">
                        Our bet results are backed by Chainlink VRF so you can
                        trust that every spin and deal is completely fair and
                        random.
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/3 md:mr-4 h-60 rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB]">
                    <div className="flex flex-col justify-center text-center h-full bg-[#2F3030] text-white rounded-[10px] p-4">
                      <div className="text-xl lg:text-3xl text-white">
                        Play, earn, and win ZeroHero NFTs!
                      </div>
                      <div className="text-base lg:text-xl text-[#808080]">
                        1% of all bets will be distributed back to ZeroHero
                        holders. If you lose 13 consecutive flips of 4 SUI or
                        more, we'll airdrop you a free random ZeroHero NFT.
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/3 h-60 rounded-tl-[100px] rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB]">
                    <div className="flex flex-col justify-center text-right h-full bg-[#2F3030] text-white rounded-tl-[100px] rounded-[10px] p-4">
                      <div className="text-xl lg:text-3xl text-white">
                        Play risk free
                      </div>
                      <div className="text-base lg:text-xl text-[#808080]">
                        We do not require user registration or funds to be
                        deposited. Simply connect to the website and place bets
                        straight from your wallet.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    );
}
