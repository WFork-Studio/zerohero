import styles from "../styles/Home.module.css";
import fsPromises from "fs/promises";
import path from "path";

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "dummy.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: objectData,
  };
}

export default function Statistics(statsDatas) {
  const stats = statsDatas.statistics;
  return (
    <section className="font-coolvetica">
      <div className={styles.container}>
        <div className="flex items-center pt-3 justify-between">
          <div className="text-white text-6xl py-5">
            All
            <br /> Statistics
          </div>
          <div className="flex items-center pt-3">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[250px] mr-2">
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
                      50203
                      <br />
                      <div className="text-[#8C8888] text-sm">
                        Gamble sum: 71,419,291
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[250px] mr-2">
              <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                <thead
                  className="text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                  style={{ backgroundColor: "#2F3030" }}
                >
                  <tr>
                    <th scope="col" className="px-6 py-1">
                      Wins
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
                      30525
                      <br />
                      <div className="text-[#8C8888] text-sm">
                        Gamble sum: 46,419,123
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[250px] mr-2">
              <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                <thead
                  className="text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                  style={{ backgroundColor: "#2F3030" }}
                >
                  <tr>
                    <th scope="col" className="px-6 py-1">
                      Loses
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
                      19678
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[800px]">
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
              {stats.map((stat) => (
                <tr
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
              {/* <tr
                className="border-b border-gray-200 dark:border-gray-700 text-white"
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
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
