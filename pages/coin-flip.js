import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useWallet, useAccountBalance, ConnectButton } from "@suiet/wallet-kit";
import path from "path";
import fsPromises from "fs/promises";
import MediaQuery from 'react-responsive'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react';
import { JsonRpcProvider, testnetConnection, TransactionBlock, Inputs } from '@mysten/sui.js';
import { ToastContainer, toast } from 'react-toastify';
import Confetti from 'react-confetti'
const provider = new JsonRpcProvider(testnetConnection);

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "dummy.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: objectData,
  };
}

export default function CoinFlip(statsDatas) {
  const wallet = useWallet();
  const { balance: walletBalance } = useAccountBalance();
  const [domLoaded, setDomLoaded] = useState(false);
  const [RecentlyPlay, setRecentlyPlay] = useState();
  const [Picked, setPicked] = useState(false);
  const [Wager, setWager] = useState(1);
  const [MultipleBets, setMultipleBets] = useState(1);
  const [MaxPayout, setMaxPayout] = useState(0);
  const [TotalWager, setTotalWager] = useState(0);
  const [MinBet, setMinBet] = useState();
  const [MaxBet, setMaxBet] = useState();
  const [IsConfetti, setIsConfetti] = useState(false);
  const [StatusGame, setStatusGame] = useState('ready');
  const [IsWin, setIsWin] = useState(false);
  const [FlipResult, setFlipResult] = useState(false);
  const stats = statsDatas.statistics;
  const isDesktop = useMediaQuery({ minWidth: 992 })
  const isTabletOrMobile = useMediaQuery({ maxWidth: 991.9 })

  const contextClass = {
    info: "bg-[#6103bf]"
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
      id: '0xf91e8c689a0b8eab5b1da09e636e4d3c972637816278f298fb0a37fe5699aea0',
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
        var chooseValue;
        if (Picked) {
          chooseValue = 'tail';
        } else {
          chooseValue = 'head';
        }

        const betValue = Number(Wager) * 1000000000;

        const packageId = "0x887860346e70e750d8b86b3a5b0203e99174c35c14cfb78c41286b482d4ea024";
        const coinFlipId = "0xf91e8c689a0b8eab5b1da09e636e4d3c972637816278f298fb0a37fe5699aea0";
        const tx = new TransactionBlock();
        let [coin] = tx.splitCoins(tx.gas, [tx.pure(betValue)]);
        tx.setGasBudget(10000000);
        tx.moveCall({
          target: `${packageId}::coinFlip::play_game`,
          typeArguments: [],
          arguments: [tx.object(coinFlipId), coin, tx.pure(chooseValue), tx.object(Inputs.SharedObjectRef({
            objectId: "0x6",
            initialSharedVersion: 1,
            mutable: false
          }))],
        })

        const result = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: tx,
          options: {
            showEvents: true
          }

        });
        
        setFlipResult(result.events[0].parsedJson?.bet);
        if (result.events[0].parsedJson?.winning === 'win') {
          setIsConfetti(true);
          setIsWin(true);
        } else {
          setIsWin(false);
        }
        setStatusGame('over')
      } else {
        toast.info("You don't have sufficient balance !", {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    } catch (error) {
      console.log(error);
      if (error.toString().includes("Rejected from user")) {
        // nothing
      } else {
        toast.info("Something is wrong please try again !", {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }

    }
  };

  useEffect(() => {
    setDomLoaded(true);
    getMinMax();
  }, []);

  useEffect(() => {
    calculateBet();
  }, [MultipleBets, Wager]);

  useEffect(() => {
    if (!IsConfetti) return;

    const intervalId = setInterval(() => {
      setIsConfetti(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [IsConfetti]);

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
                    {RecentlyPlay?.map((stat, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                        style={{ backgroundColor: "#262626" }}
                      >
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap dark:text-white inline-flex"
                        >
                          {stat.sender} choose {stat.bet.charAt(0).toUpperCase() + stat.bet.slice(1)} with result
                          {stat.winning === "lose" ? (
                            <div className="flex items-center justify-center" style={{ color: 'red' }}>
                              <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />-
                              {(Number(stat.bet_amount) / 100000000).toFixed(2)}
                            </div>
                          )
                            : (
                              <div className="flex items-center justify-center" style={{ color: 'green' }}>
                                <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />+
                                {(Number(stat.profit) / 100000000).toFixed(2)}
                              </div>
                            )}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap text-end dark:text-white"
                        >
                          {Number(stat.time)}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
          <div className="col-span-3 w-1/3 h-full w-full mr-4 h-60 bg-gradient-to-r p-[6px] from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] rounded-lg">
            {StatusGame === 'ready' ?
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
                        <label className="block mb-2 text-sm font-medium text-white text-end">Min {MinBet}</label>
                      </div>
                      <input value={Wager} onChange={(e) => { setWager(e.target.value) }} type="text" className="bg-black border border-primary-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
                      <label className="block mb-2 text-sm font-bold text-primary-500 bg-primary-800 w-fit float-right p-1 rounded-md text-end mt-1.5">Max {MaxBet}</label>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white">Multiple Bets</label>
                      <input value={MultipleBets} disabled type="text" className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
                      <input value={MultipleBets} onChange={(e) => { setMultipleBets(e.target.value) }} type="range" min={1} max={5} step={1} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className='mt-4 grid grid-cols-2 space-x-4'>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-white">Max Payout</label>
                        <input value={MaxPayout} onChange={(e) => { setMaxPayout(e.target.value) }} type="text" disabled className="bg-black border border-primary-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="" />
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
                    <div className='mt-6 play-wrapper'>
                      {wallet?.connected ?
                        <>
                          {Number(TotalWager) <= Number(MaxBet) && Number(TotalWager) >= Number(MinBet) ?
                            <button onClick={playGame} className='w-full py-2 bg-primary-800 rounded-lg text-black font-bold'>PLAY</button>
                            :
                            <button disabled className='w-full py-2 bg-gray-500 rounded-lg text-gray-300 text-sm font-bold'>Total Bet doesn't meet min/max requirements.</button>
                          }
                        </>
                        :
                        <ConnectButton label="Connect Wallet" />
                      }
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className="justify-center h-full bg-[#2F3030] text-white p-4 rounded-lg grid">
                <div className="lg:px-10 self-center">
                  <div className='2xl:px-14'>
                    {IsWin ?
                      <div className='text-center'>
                        <label className="block mb-2 text-5xl font-bold text-white">WIN</label>
                        <label className="block mb-2 text-3xl font-medium" style={{ color: 'green' }}>+{MaxPayout}</label>
                        {FlipResult === 'head' ?
                          <img className='mx-auto' style={{ width: '15em' }} src='/images/head-coin.png' />
                          :
                          <img className='mx-auto' style={{ width: '15em' }} src='/images/tail-coin.png' />
                        }
                      </div>
                      :
                      <div className='text-center'>
                        <label className="block mb-2 text-5xl font-bold text-white">LOSE</label>
                        <label className="block mb-2 text-3xl font-medium" style={{ color: 'red' }}>-{TotalWager}</label>
                        {FlipResult !== 'head' ?
                          <img className='mx-auto' style={{ width: '15em' }} src='/images/head-coin.png' />
                          :
                          <img className='mx-auto' style={{ width: '15em' }} src='/images/tail-coin.png' />
                        }
                      </div>
                    }
                    <div className='mt-6 play-wrapper text-center'>
                      <button onClick={() => setStatusGame('ready')} className='w-full py-2 bg-primary-800 rounded-lg text-black font-bold'>Try Again</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          {isTabletOrMobile &&
            <div className='col-span- mt-6'>
              <h1 className='px-6 py-3 text-center text-lg font-bold rounded-t-lg' style={{ backgroundColor: "#2F3030" }}>Recently Play</h1>
              <div className="relative overflow-x-auto shadow-md rounded-b-lg">
                <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                  <tbody>
                    {RecentlyPlay.map((stat, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                        style={{ backgroundColor: "#262626" }}
                      >
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap dark:text-white inline-flex"
                        >
                          {stat.sender} choose {stat.result} with result
                          {Number(stat.profit) < 0 ? (
                            <div className="flex items-center justify-center" style={{ color: 'red' }}>
                              <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />
                              {stat.profit}
                            </div>
                          )
                            : (
                              <div className="flex items-center justify-center" style={{ color: 'green' }}>
                                <img width={25} src="/images/sui_brand.png" alt="Sui Brand" />+
                                {(Number(stat.profit) / 100000000).toFixed(2)}
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
          <div>
            <ToastContainer
              toastClassName={({ type }) => contextClass[type || "default"] +
                " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer font-bold w-max"
              } />
          </div>
          {IsConfetti &&
            <Confetti />
          }
        </div>
      )}
    </>
  )
}
