import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <section className="font-coolvetica">
      <div className={styles.container}>
        <div className="grid grid-cols-2 gap-2 p-3">
          <div className="p-10 rounded-lg row-span-2 content-center">
            <div className="row-span-3 text-white text-7xl py-20">
              <div className="col-span-3">Work is overrated</div>
              <div className="row-span-3 col-span-3">Retire early at</div>
              <div
                className="row-span-3 col-span-3"
                style={{ color: "#00F0FF" }}
              >
                ZeroHero
              </div>
            </div>
          </div>
          <div className="text-white text-lg font-bold text-center p-10 rounded-lg">
            <div
              id="carouselExampleIndicators"
              className="relative"
              data-te-carousel-init
              data-te-carousel-slide
            >
              <div
                className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
                data-te-carousel-indicators
              >
                <button
                  type="button"
                  data-te-target="#carouselExampleIndicators"
                  data-te-slide-to="0"
                  data-te-carousel-active
                  className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-te-target="#carouselExampleIndicators"
                  data-te-slide-to="1"
                  className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-te-target="#carouselExampleIndicators"
                  data-te-slide-to="2"
                  className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
                  aria-label="Slide 3"
                ></button>
              </div>

              <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
                <div
                  className="relative float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
                  data-te-carousel-item
                  data-te-carousel-active
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/slides/041.webp"
                    className="block w-full"
                    alt="Wild Landscape"
                  />
                </div>
                <div
                  className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
                  data-te-carousel-item
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp"
                    className="block w-full"
                    alt="Camera"
                  />
                </div>
                <div
                  className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
                  data-te-carousel-item
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/slides/043.webp"
                    className="block w-full"
                    alt="Exotic Fruits"
                  />
                </div>
              </div>

              <button
                className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                type="button"
                data-te-target="#carouselExampleIndicators"
                data-te-slide="prev"
              >
                <span className="inline-block h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </span>
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Previous
                </span>
              </button>
              <button
                className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                type="button"
                data-te-target="#carouselExampleIndicators"
                data-te-slide="next"
              >
                <span className="inline-block h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Next
                </span>
              </button>
            </div>
          </div>
          <div className="shadow-lg bg-gray-900 text-white text-lg font-bold text-center p-10 rounded-lg row-span-2">
            3
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
              <tr
                className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                style={{ backgroundColor: "#262626" }}
              >
                <th
                  scope="row"
                  className="px-6 py-1 font-medium whitespace-nowrap dark:text-white"
                >
                  Flip Coin
                </th>
                <td className="px-6 py-1">2 minutes ago</td>
                <td className="px-6 py-1 text-center">0xa467.....21948129</td>
                <td className="px-6 py-1">
                  <div className="flex items-center justify-center">
                    <img src="/images/sui_brand.png" alt="Sui Brand" />
                    10.00
                  </div>
                </td>
                <td className="px-6 py-1 text-green-500">
                  <div className="flex items-center justify-center">
                    <img src="/images/sui_brand.png" alt="Sui Brand" />
                    +10.00
                  </div>
                </td>
              </tr>
              <tr
                className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                style={{ backgroundColor: "#262626" }}
              >
                <th
                  scope="row"
                  className="px-6 py-1 font-medium whitespace-nowrap dark:text-white"
                >
                  Flip Coin
                </th>
                <td className="px-6 py-1">2 minutes ago</td>
                <td className="px-6 py-1 text-center">0xa467.....21948129</td>
                <td className="px-6 py-1">
                  <div className="flex items-center justify-center">
                    <img src="/images/sui_brand.png" alt="Sui Brand" />
                    5.00
                  </div>
                </td>
                <td className="px-6 py-1 text-red-500">
                  <div className="flex items-center justify-center">
                    <img src="/images/sui_brand.png" alt="Sui Brand" />
                    -5.00
                  </div>
                </td>
              </tr>
              <tr className="text-white" style={{ backgroundColor: "#262626" }}>
                <th
                  scope="row"
                  className="px-6 py-1 font-medium whitespace-nowrap dark:text-white"
                >
                  Catch'em All
                </th>
                <td className="px-6 py-1">2 hours ago</td>
                <td className="px-6 py-1 text-center">0xa467.....21948129</td>
                <td className="px-6 py-1">
                  <div className="flex items-center justify-center">
                    <img src="/images/sui_brand.png" alt="Sui Brand" />
                    5.00
                  </div>
                </td>
                <td className="px-6 py-1 text-green-500">
                  <div className="flex items-center justify-center">
                    <img src="/images/sui_brand.png" alt="Sui Brand" />
                    +5.00
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            className="flex items-center justify-between pt-2"
            style={{ backgroundColor: "#2F3030" }}
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-white dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-white dark:text-white">
                3
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white dark:text-white">
                50203
              </span>{" "}
              statistics data
            </span>
            <div className="inline-flex items-center -space-x-px text-white">
              Show more
            </div>
          </nav>
        </div>
        <div className="pt-8 font-coolvetica text-2xl text-white">
          Game List
        </div>
        <div className="flex items-center pt-3">
          <img className="pr-5" src="/images/flipcoin.png" alt="Flip Coin" />
          <img
            className="pr-5"
            src="/images/catchemall.png"
            alt="Catch'em All"
          />
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
        <div
          class="mx-auto h-0 w-0 border-r-[25px] border-b-[55px] 
border-l-[25px] border-solid border-r-transparent
border-l-transparent border-b-[#000]"
        ></div>
      </div>
    </section>
  );
}
