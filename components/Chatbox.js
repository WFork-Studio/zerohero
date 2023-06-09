import React, { useState, useEffect, useRef, useContext } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { AppContext } from "../utils/AppContext";
import { sendMessage } from "../pages/api/db_services";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Chatbox() {
  const messagesColumnRef = useRef(null);
  const [message, setMessage] = useState("");
  const { chatbox, state } = useContext(AppContext);
  const { messagesReceived } = chatbox;
  const { userData, playerCurrentLevel } = state;
  const { t } = useTranslation('common');
  const wallet = useWallet();

  const sendMessageHandle = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      await sendMessage(userData.id, trimmedMessage, {
        levelName: playerCurrentLevel.levelName,
        colorHex: playerCurrentLevel.colorHex,
        image: playerCurrentLevel.image,
      });
      setMessage("");
    }
  };

  const ChatBubble = ({ message, key }) => (
    <div
      className="mx-auto flex h-auto max-w-screen-sm items-start justify-start pb-1"
      key={key}
    >
      <div className="w-full rounded-[8px] rounded-bl-[0px] bg-gradient-to-r from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] p-0.5">
        <div className="rounded-[8px] rounded-bl-[0px] h-auto break-all w-full bg-[#121212] back p-2">
          <span
            className="inline-block overflow-hidden whitespace-nowrap text-ellipsis align-bottom"
            style={{ color: "#" + message.colorHex, maxWidth: "7rem" }}
          >
            {message.username === null
              ? message.walletAddress.substr(0, 4) +
              "....." +
              message.walletAddress.substr(
                message.walletAddress.length - 4,
                message.walletAddress.length
              )
              : message.username}
          </span>
          <img
            className="w-5 h-5 rounded-full inline mx-1"
            src={message.image}
            alt="badges"
          />
          <span className="align-bottom mb-auto text-white">
            : {message.message}
          </span>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesReceived]);

  //Animation And Etc
  useEffect(() => {
    const element = document.querySelector(".floating-chat");

    setTimeout(() => {
      element.classList.add("enter");
    }, 1000);

    const openElement = () => {
      element.classList.add("expand");
      element.querySelector(".chat").classList.add("enter");
      element.removeEventListener("click", openElement);
      element
        .querySelector(".header button")
        .addEventListener("click", closeElement);
    };

    const closeElement = () => {
      element.querySelector(".chat").classList.remove("enter");
      element.classList.remove("expand");
      element
        .querySelector(".header button")
        .removeEventListener("click", closeElement);
      setTimeout(() => {
        element.querySelector(".chat").classList.remove("enter");
        element.addEventListener("click", openElement);
      }, 500);
    };

    element.addEventListener("click", openElement);

    return () => {
      element.removeEventListener("click", openElement);
      element
        .querySelector(".header button")
        .removeEventListener("click", closeElement);
    };
  }, []);

  function onMetaAndEnter(evt) {
    if (evt.keyCode === 13) {
      if (message !== "" || message !== null) {
        sendMessageHandle();
      }
    }
  }
  return (
    <div className="floating-chat">
      <i
        className="fa fa-comments text-white"
        style={{ fontSize: "1.25em" }}
        aria-hidden="true"
      ></i>
      <div className="chat">
        <div className="header">
          <span className="title font-coolvetica text-white">
            {t('chatbox_content.title_chatbox')}
          </span>
          <button>
            <i className="fa fa-times text-white" aria-hidden="true"></i>
          </button>
        </div>
        <ul
          className="messages font-coolvetica text-sm"
          ref={messagesColumnRef}
        >
          {messagesReceived.map((msg, i) => (
            <ChatBubble message={msg} key={i} />
          ))}
        </ul>
        <div className="footer">
          {wallet.address === undefined ? (
            <div className="w-full">
              <ConnectButton
                label="Connect Wallet"
                style={{ textTransform: "capitalize" }}
              />
            </div>
          ) : (
            <>
              <input
                className="text-box"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onMetaAndEnter}
              ></input>
              <button className="font-coolvetica" onClick={sendMessageHandle}>
                <i className="fa fa-paper-plane pl-2 pr-2"></i>
              </button>
            </>
          )}
        </div>
        <div className="font-coolvetica text-xs pt-1 text-ellipsis">
          {t('chatbox_content.connected')}:
          {wallet.address != undefined ? (
            <>
              {" "}
              {wallet.address.substring(0, 12)}.....
              {wallet.address.substring(
                wallet.address.length - 12,
                wallet.address.length
              )}
            </>
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
    // <Html>
    //   <Head></Head>
    //   <body>
    //     <Main />
    //     <NextScript />
    //   </body>
    // </Html>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
