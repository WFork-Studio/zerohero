import styles from "../styles/Home.module.css";
import { getAllHistories, getStatsData } from "./api/db_services";
import { useState, useEffect, useContext } from "react";
import moment from "moment/moment";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/Spinner";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import "moment/locale/de";
import "moment/locale/es";
import { AppContext } from "../utils/AppContext";

export function configureMoment(langauge) {
  moment.locale(langauge);
}

export default function Statistics(statsDatas) {
  const { t } = useTranslation("global");
  const { locale } = useRouter();
  const [isLoad, setisLoad] = useState();
  const [allHistories, setAllHistories] = useState([]);
  const [statsData, setStatsData] = useState();

  const { state } = useContext(AppContext);
  const { supabase } = state;
  const getHistories = async (e) => {
    const resp = await getAllHistories(null, 20);
    const statDatas = await getStatsData();
    setStatsData(statDatas);
    setAllHistories(resp);
    setisLoad(true);
  };

  useState(() => {
    getHistories();

    const subsHistories = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        (payload) => {
          console.log(payload);
          setAllHistories((prevData) => {
            const newData = [...prevData.records, payload.new];
            return {
              records: newData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 20),
              count: prevData.count + 1,
            };
          });
        }
      )
      .subscribe();

    return () => {
      subsHistories.unsubscribe();
    };
  }, []);

  useEffect(() => {
    configureMoment(locale);
  }, [locale]);

  if (isLoad) {
    return (
      <>
        <section className="font-coolvetica pb-7">
          <div className={styles.container}>
            <div className="lg:flex mb-4 items-center pt-3 justify-between lg:overflow-x-auto lg:space-x-4">
              <div className="text-white text-6xl py-5">
                {t("statistics_content.statistics_title")}
              </div>
              <div className="flex items-center pt-3">
                <div className="relative overflow-x-auto shadow-md rounded-lg w-[250px] mr-2">
                  <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                    <thead
                      className="text-xs md:text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                      style={{ backgroundColor: "#2F3030" }}
                    >
                      <tr>
                        <th scope="col" className="px-2 md:px-6 py-1">
                          {t("statistics_content.total_bets")}
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
                          className="text-base md:text-3xl md:px-6 py-2 pb-2 font-medium md:whitespace-nowrap dark:text-white"
                        >
                          {allHistories.count}
                          <br />
                          {/* <div className="text-[#8C8888] text-sm">
                          Gamble sum: 71,419,291
                        </div> */}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="relative overflow-x-auto shadow-md rounded-lg w-[250px] mr-2">
                  <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                    <thead
                      className="text-xs md:text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                      style={{ backgroundColor: "#2F3030" }}
                    >
                      <tr>
                        <th scope="col" className="px-2 md:px-6 py-1">
                          {t("statistics_content.wins")}
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
                          className="text-base md:text-3xl md:px-6 py-2 pb-2 font-medium md:whitespace-nowrap dark:text-white"
                        >
                          {statsData[0].total_wins}
                          <br />
                          {/* <div className="text-[#8C8888] text-sm">
                          Gamble sum: 46,419,123
                        </div> */}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="relative overflow-x-auto shadow-md rounded-lg w-[250px] mr-2">
                  <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica">
                    <thead
                      className="text-xs md:text-lg text-center text-[#00F0FF] dark:text-white tracking-widest"
                      style={{ backgroundColor: "#2F3030" }}
                    >
                      <tr>
                        <th scope="col" className="px-2 md:px-6 py-1">
                          {t("statistics_content.loses")}
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
                          className="text-base md:text-3xl md:px-6 py-2 pb-2 font-medium md:whitespace-nowrap dark:text-white"
                        >
                          {statsData[0].total_losses}
                          <br />
                          {/* <div className="text-[#8C8888] text-sm">
                          Gamble sum: 30,219,291
                        </div> */}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="table-wrp relative overflow-x-auto shadow-md rounded-lg max-h-[800px] block max-h-96">
              <table className="w-full text-base text-left text-gray-500 dark:text-gray-400 font-coolvetica whitespace-nowrap">
                <thead
                  className="text-xs text-white dark:text-white tracking-widest sticky"
                  style={{ backgroundColor: "#2F3030" }}
                >
                  <tr className="text-lg">
                    <th scope="col" className="px-6 py-3">
                      {t("statistics_content.game")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("statistics_content.time")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t("statistics_content.player")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t("statistics_content.wager")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t("statistics_content.profit")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allHistories.records.map((stat, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#2F3030] dark:border-[#2F3030] text-white"
                      style={{ backgroundColor: "#262626" }}
                    >
                      <th
                        scope="row"
                        className="px-6 font-medium whitespace-nowrap dark:text-white"
                      >
                        {stat.gameName}
                      </th>
                      <td className="px-6">
                        {moment(Number(Date.parse(stat.createdAt))).fromNow()}
                      </td>
                      <td className="px-6 text-center">
                        {stat.walletAddress.substr(0, 4) +
                          "....." +
                          stat.walletAddress.substr(
                            stat.walletAddress.length - 4,
                            stat.walletAddress.length
                          )}{" "}
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
                            <img src="/images/sui_brand.png" alt="Sui Brand" />-
                            {stat.wager}
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
