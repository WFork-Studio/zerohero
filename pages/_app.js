import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import Chatbox from "../components/Chatbox";
import * as React from "react";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

import io from "socket.io-client";
import { useState, useEffect } from "react";
// import fsPromises from "fs/promises";
// import path from "path";

// export async function getServerSideProps() {
//   const filePath = path.join(process.cwd(), "dummy.json");
//   const jsonData = await fsPromises.readFile(filePath);
//   const objectData = JSON.parse(jsonData);

//   return {
//     props: objectData,
//   };
// }

function MyApp({ Component, pageProps }) {
  const [room, setRoom] = useState("zerohero_chatbox");
  const [socket, setSocket] = useState(io.connect("http://localhost:4001"));

  useEffect(() => {
    const newS = io("http://localhost:4001");
    newS.on("connect", (socket) => {
      console.log("socket connected", socket);
    });
    setSocket(newS);
    return () => socket.close();
  }, [setSocket]);

  return (
    <>
      <WalletProvider>
        <Head>
          <title>Zero Hero</title>
          <meta name="description" content="Zero Hero Official Website" />
          <link rel="icon" href="/favicon.ico" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" />
          <script src="/js/chatbox.js" />
          <link rel="stylesheet" href="/css/chatbox.css"></link>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          ></link>
        </Head>
        <header>
          <Navbar />
        </header>
        <Component {...pageProps} />

        <Footer />

        <Chatbox room={room} setRoom={setRoom} socket={socket} />
      </WalletProvider>
    </>
  );
}

export default MyApp;
