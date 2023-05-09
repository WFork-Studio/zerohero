import styles from "../styles/Home.module.css";
import fsPromises from "fs/promises";
import path from "path";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "dummy.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: objectData,
  };
}

export default function Home(statsDatas) {
  const stats = statsDatas.statistics;

  const images = [
    { url: "images/nft1.JPG" },
    { url: "images/nft2.JPG" },
    { url: "images/nft3.JPG" },
  ];
  return (
    <section className="font-coolvetica pb-7">
      <div className={styles.container}>
        <div className="flex items-center pt-3 justify-between">
          <div className="row-span-3 text-white text-7xl py-20">
            <div className="col-span-3">Work is overrated</div>
            <div className="row-span-3 col-span-3">Retire early at</div>
            <div className="row-span-3 col-span-3" style={{ color: "#00F0FF" }}>
              ZeroHero
            </div>
          </div>
          <div className="w-1/2 h-max grid grid-cols-1">
            <div className="h-72 shadow-lg w-full">
              <div className="flex">
                <div className="text-3xl text-white w-[50%] p-3 items-center justify-center pt-10 pl-12">
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
                        className="rounded-xl h-[220px]"
                        src="images/nft1.JPG"
                      />
                    </div>
                    <div>
                      <img
                        className="rounded-xl h-[220px]"
                        src="images/nft2.JPG"
                      />
                    </div>
                    <div>
                      <img
                        className="rounded-xl h-[220px]"
                        src="images/nft3.JPG"
                      />
                    </div>
                  </Carousel>
                </div>
                <div className="w-[50%] h-72">
                  <img
                    className="pt-10"
                    style={{ float: "right" }}
                    src="/images/buynow.png"
                    alt="Buy Now"
                  />
                </div>
              </div>
            </div>
            <div className="flex pt-2 pb-2 justify-end items-end">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[250px] mr-2">
                <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                  <thead
                    className="text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                    style={{ backgroundColor: "#2F3030" }}
                  >
                    <tr>
                      <th scope="col" className="px-6 py-1">
                        Total Wagered
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
                        className="text-3xl px-6 py-2 pb-2 font-medium whitespace-nowrap dark:text-white"
                      >
                        3
                        <br />
                        <div className="text-[#8C8888] text-sm">
                          Gamble sum: 30,219,291
                        </div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[250px]">
                <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                  <thead
                    className="text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                    style={{ backgroundColor: "#2F3030" }}
                  >
                    <tr>
                      <th scope="col" className="px-6 py-1">
                        Total Bets
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
                        className="text-3xl px-6 py-2 pb-2 font-medium whitespace-nowrap dark:text-white"
                      >
                        {stats.length}
                        <br />
                        <div className="text-[#8C8888] text-sm">
                          Gamble sum: 30,219,291
                        </div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
            <thead
              className="text-xs text-white dark:text-white tracking-widest"
              style={{ backgroundColor: "#2F3030" }}
            >
              <tr className="text-lg">
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
              {stats.slice(0, 3).map((stat, index) => (
                <tr
                  key={index}
                  className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                  style={{ backgroundColor: "#262626" }}
                >
                  <th
                    scope="row"
                    className="px-6 font-medium whitespace-nowrap dark:text-white"
                  >
                    {stat.game}
                  </th>
                  <td className="px-6">{stat.time}</td>
                  <td className="px-6 text-center">{stat.player}</td>
                  <td className="px-6">
                    <div className="flex items-center justify-center">
                      <img src="/images/sui_brand.png" alt="Sui Brand" />
                      {stat.wager}
                    </div>
                  </td>
                  {stat.profit < 0 ? (
                    <td className="px-6 py-1 text-red-500">
                      <div className="flex items-center justify-center">
                        <img src="/images/sui_brand.png" alt="Sui Brand" />
                        {stat.profit}
                      </div>
                    </td>
                  ) : (
                    <td className="px-6 py-1 text-green-500">
                      <div className="flex items-center justify-center">
                        <img src="/images/sui_brand.png" alt="Sui Brand" />+
                        {stat.profit}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <nav
            className="flex items-center justify-between p-2"
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
                {stats.length}
              </span>{" "}
              statistics data
            </span>
            <a
              className="inline-flex items-center -space-x-px text-white pr-2"
              href="/statistics"
            >
              Show more
            </a>
          </nav>
        </div>
        <div className="pt-8 font-coolvetica text-2xl text-white">
          Game List
        </div>
        <div className="flex items-center pt-3">
          <a href="/coin-flip">
            <img className="pr-5" src="/images/flipcoin.png" alt="Flip Coin" />
          </a>

          <a href="/catchem-all">
            <img
              className="pr-5"
              src="/images/catchemall.png"
              alt="Catch'em All"
            />
          </a>
          <img className="pr-5" src="/images/dice.png" alt="Dice" />
          <img
            className="pr-5"
            src="/images/rps.png"
            alt="Rock Paper Scissors"
          />
        </div>
        <div className="pt-8 font-coolvetica text-2xl text-white overflow-auto">
          <div className="flex items-center pt-3 justify-between">
            <div className="w-1/3 mr-4 h-60 rounded-tr-[100px] rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB]">
              <div className="flex flex-col justify-center h-full bg-[#2F3030] text-white rounded-tr-[100px] rounded-[10px] p-4">
                <div className="text-3xl text-white">Provably fair betting</div>
                <div className="text-xl text-[#808080]">
                  Our bet results are backed by Chainlink VRF so you can trust
                  that every spin and deal is completely fair and random.
                </div>
              </div>
            </div>
            <div className="w-1/3 mr-4 h-60 rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB]">
              <div className="flex flex-col justify-center text-center h-full bg-[#2F3030] text-white rounded-[10px] p-4">
                <div className="text-3xl text-white">
                  Play, earn, and win ZeroHero NFTs!
                </div>
                <div className="text-xl text-[#808080]">
                  1% of all bets will be distributed back to ZeroHero holders.
                  If you lose 13 consecutive flips of 4 SUI or more, we'll
                  airdrop you a free random ZeroHero NFT.
                </div>
              </div>
            </div>
            <div className="w-1/3 h-60 rounded-tl-[100px] rounded-[10px] bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB]">
              <div className="flex flex-col justify-center text-right h-full bg-[#2F3030] text-white rounded-tl-[100px] rounded-[10px] p-4">
                <div className="text-3xl text-white">Play risk free</div>
                <div className="text-xl text-[#808080]">
                  We do not require user registration or funds to be deposited.
                  Simply connect to the website and place bets straight from
                  your wallet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
