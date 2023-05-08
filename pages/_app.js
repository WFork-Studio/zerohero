import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Chatbox from "../components/Chatbox";
import * as React from "react";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" />
      <Script src="/js/chatbox.js" />
      <Head>
        <title>Zero Hero</title>
        <meta name="description" content="Zero Hero Official Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Navbar />
      </header>
      <Component {...pageProps} />
      <Chatbox />
    </>
  );
}

export default MyApp;
