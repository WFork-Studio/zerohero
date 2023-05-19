import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import path from "path";
import fsPromises from "fs/promises";
import MediaQuery from 'react-responsive'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "dummy.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: objectData,
  };
}

export default function CoinFlip(statsDatas) {
  const [domLoaded, setDomLoaded] = useState(false);
  const [Picked, setPicked] = useState(false);
  const [Wager, setWager] = useState(1);
  const [MultipleBets, setMultipleBets] = useState(1);
  const [MayPayout, setMayPayout] = useState(0);
  const [TotalWager, setTotalWager] = useState(0);
  const stats = statsDatas.statistics;
  const isDesktop = useMediaQuery({ minWidth: 992 })
  const isTabletOrMobile = useMediaQuery({ maxWidth: 991.9 })

  const calculateBet = async () => {
    // console.log(Number(Wager), Number(MultipleBets));
    var total_wager = Number(Wager) * Number(MultipleBets);
    //  var max_payout = ((Number(Wager) * 2) * Number(MultipleBets)) / 10;
    setTotalWager(total_wager);
    //  setMayPayout(max_payout);
    // Define the wager amount

    // Calculate the wager multiplied by 2
    const wagerMultipliedBy2 = Number(Wager) * 2;

    // Calculate both the wager and the multiplied amount multiplied by 2
    const totalMultipliedBy2 = wagerMultipliedBy2 * Number(MultipleBets);

    // Calculate the final result after dividing by 10%
    const finalResult = totalMultipliedBy2 / 10;

    console.log(finalResult);
  };

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    calculateBet();
  }, [MultipleBets, Wager]);

  return (
    <>
      {domLoaded && (
        <div className='px-4 lg:px-10 py-10 lg:py-24 lg:grid lg:grid-cols-5'>
          {isTabletOrMobile &&
            <div className='pb-6'>
              <h1 className='text-center text-4xl font-bold text-primary-800'>Coin Flip</h1>
              <h3 className='text-center text-2xl font-bold'>Game</h3>
            </div>
          }
          {isDesktop &&
            <div className='col-span-2 px-4'>
              <div className='pb-6'>
                <h1 className='text-center text-4xl font-bold text-primary-800'>Coin Flip</h1>
                <h3 className='text-center text-2xl font-bold'>Game</h3>
              </div>
              <h1 className='px-6 py-3 text-center text-lg font-bold rounded-t-lg' style={{ backgroundColor: "#2F3030" }}>Recently Play</h1>
              <div className="relative overflow-x-auto shadow-md rounded-b-lg">
                <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                  <tbody>
                    {stats.slice(0, 10).map((stat, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                        style={{ backgroundColor: "#262626" }}
                      >
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap dark:text-white inline-flex"
                        >
                          {stat.player} choose {stat.game} with result
                          {stat.profit < 0 ? (
                            <div className="flex items-center justify-center" style={{ color: 'red' }}>
                              <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />
                              {stat.profit}
                            </div>
                          )
                            : (
                              <div className="flex items-center justify-center" style={{ color: 'green' }}>
                                <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />+
                                {stat.profit}
                              </div>
                            )}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap text-end dark:text-white"
                        >
                          {stat.time}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
          <div className="col-span-3 w-1/3 h-full w-full mr-4 h-60 bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] rounded-lg">
            <div className="lg:grid lg:grid-cols-5 justify-center h-full bg-[#2F3030] text-white p-4 rounded-lg">
              <div className="col-span-2 xl:px-2 2xl:px-8 self-center">
                {Picked ?
                  <img className='mx-auto' src='/images/tail-coin.png' />
                  :
                  <img className='mx-auto' src='/images/head-coin.png' />
                }
              </div>
              <div className="col-span-3 lg:px-10 self-center">
                <h1 className='text-center text-xl font-bold'>Set Your Bet</h1>
                <div className='2xl:px-10'>
                  <div className='flow-root'>
                    <div className='grid grid-cols-2'>
                      <label className="block mb-2 text-sm font-medium text-white text-start">Wager</label>
                      <label className="block mb-2 text-sm font-medium text-white text-end">Min 0.5</label>
                    </div>
                    <input value={Wager} onChange={(e) => { setWager(e.target.value) }} type="text" className="bg-black border border-primary-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
                    <label className="block mb-2 text-sm font-bold text-primary-500 bg-primary-800 w-fit float-right p-1 rounded-md text-end mt-1.5">Max 80</label>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white">Multiple Bets</label>
                    <input value={MultipleBets} disabled type="text" className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
                    <input value={MultipleBets} onChange={(e) => { setMultipleBets(e.target.value) }} type="range" min={1} max={5} step={1} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className='mt-4 grid grid-cols-2 space-x-4'>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white">Max Payout</label>
                      <input value={MayPayout} onChange={(e) => { setMayPayout(e.target.value) }} type="text" disabled className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white text-end">Total Wager</label>
                      <input value={TotalWager} onChange={(e) => { setTotalWager(e.target.value) }} type="text" disabled className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
                    </div>
                  </div>
                  <div className='mt-4'>
                    <label className="block mb-2 text-sm font-medium text-white">Pick a Side</label>
                    <div className='grid grid-cols-2 space-x-4'>
                      <div>
                        <input type="radio" id="heads" name="pick" value="heads" className="hidden peer" defaultChecked onClick={() => {
                          setPicked(false);
                        }} />
                        <label htmlFor="heads" className="justify-center inline-flex items-center w-full py-2 text-white bg-black border border-primary-500 rounded-lg cursor-pointer peer-checked:bg-primary-500 hover:text-white hover:bg-primary-500">
                          <div className="block">
                            <div className="w-full text-lg font-semibold">HEADS</div>
                          </div>
                        </label>
                      </div>
                      <div>
                        <input type="radio" id="tails" name="pick" value="tails" className="hidden peer" onClick={() => {
                          setPicked(true);
                        }} />
                        <label htmlFor="tails" className="justify-center inline-flex items-center w-full py-2 text-white bg-black border border-primary-500 rounded-lg cursor-pointer peer-checked:bg-primary-500 hover:text-white hover:bg-primary-500">
                          <div className="block">
                            <div className="w-full text-lg font-semibold">TAILS</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='mt-6'>
                    <button className='w-full py-2 bg-primary-800 rounded-lg text-black font-bold'>PLAY</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isTabletOrMobile &&
            <div className='col-span- mt-6'>
              <h1 className='px-6 py-3 text-center text-lg font-bold rounded-t-lg' style={{ backgroundColor: "#2F3030" }}>Recently Play</h1>
              <div className="relative overflow-x-auto shadow-md rounded-b-lg">
                <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                  <tbody>
                    {stats.slice(0, 10).map((stat, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                        style={{ backgroundColor: "#262626" }}
                      >
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap dark:text-white inline-flex"
                        >
                          {stat.player} choose {stat.game} with result
                          {stat.profit < 0 ? (
                            <div className="flex items-center justify-center" style={{ color: 'red' }}>
                              <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />
                              {stat.profit}
                            </div>
                          )
                            : (
                              <div className="flex items-center justify-center" style={{ color: 'green' }}>
                                <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />+
                                {stat.profit}
                              </div>
                            )}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap text-end dark:text-white"
                        >
                          {stat.time}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      )}
    </>
  )
}
