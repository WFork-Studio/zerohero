import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Chatbox from "../components/Chatbox";
import * as React from "react";
import Script from "next/script";
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';


function MyApp({ Component, pageProps }) {
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
        <Chatbox />
      </WalletProvider>
    </>
  );
}

export default MyApp;
