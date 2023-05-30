import React, { useState, useEffect, useRef } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import socketIOClient from "socket.io-client";

export default function Chatbox() {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    const socketId = localStorage.getItem("socketId");

    if (!walletAddress && !socket && !isConnected) {
      console.log(`Socket isn't connected`);
      const newSocket = socketIOClient("http://192.168.49.21:4000", {
        auth: { walletAddress: wallet.address },
        query: { socketId },
        autoConnect: true,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      newSocket.on("connect_error", () => {
        setIsConnected(false);
      });

      newSocket.on("chat message", (data) => {
        setMessagesReceived((messagesRecieved) => [
          ...messagesRecieved,
          {
            message: data.message,
            walletAddress: data.walletAddress,
          },
        ]);
      });

      newSocket.on("load messages", (messages) => {
        setMessagesReceived(messages);
      });

      // newSocket.on("system message", (message) => {
      //   setMessages((messagesRecieved) => [
      //     ...messagesRecieved,
      //     { systemMessage: message.message },
      //   ]);
      // });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setIsConnected(false);
    };
  }, [wallet]);

  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && socket) {
      socket.emit("chat message", {
        message: trimmedMessage,
        walletAddress: wallet.address,
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
          <span className="text-blue-500">
            {message.walletAddress.substr(0, 12) +
              "....." +
              message.walletAddress.substr(
                message.walletAddress.length - 12,
                message.walletAddress.length
              )}
            :
          </span>{" "}
          <span>{message.message}</span>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (wallet.address !== undefined) {
      messagesColumnRef.current.scrollTop =
        messagesColumnRef.current.scrollHeight;
    }
  }, [messagesRecieved]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  //Animation And Etc
  useEffect(() => {
    var element = document.querySelector(".floating-chat");

    setTimeout(function () {
      element.classList.add("enter");
    }, 1000);

    element.addEventListener("click", openElement);

    function openElement() {
      var messages = element.querySelector(".messages");
      var textInput = element.querySelector(".text-box");
      element.classList.add("expand");
      element.querySelector(".chat").classList.add("enter");
      element.removeEventListener("click", openElement);
      element
        .querySelector(".header button")
        .addEventListener("click", closeElement);
    }

    function closeElement() {
      element.querySelector(".chat").classList.remove("enter");
      element.classList.remove("expand");
      element
        .querySelector(".header button")
        .removeEventListener("click", closeElement);
      setTimeout(function () {
        element.querySelector(".chat").classList.remove("enter");
        element.addEventListener("click", openElement);
      }, 500);
    }
  }, []);

  function onMetaAndEnter(evt) {
    if (evt.keyCode === 13) {
      if (message !== "" || message !== null) {
        sendMessage();
      }
    }
  }
  return (
    <div className="floating-chat">
      <i
        className="fa fa-comments"
        style={{ fontSize: "1.25em" }}
        aria-hidden="true"
      ></i>
      <div className="chat">
        <div className="header">
          <span className="title font-coolvetica">
            Chat and Notification Box
          </span>
          <button>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
        {wallet.address === undefined ? (
          <div></div>
        ) : (
          <ul
            className="messages font-coolvetica text-sm"
            ref={messagesColumnRef}
          >
            {messagesRecieved.map((msg, i) => (
              <ChatBubble message={msg} key={i} />
            ))}
          </ul>
        )}

        {wallet.address === undefined ? (
          <div className="footer">
            <div className="w-full">
              <ConnectButton label="Connect Wallet" />
            </div>
          </div>
        ) : (
          <div className="footer">
            <input
              className="text-box"
              // contentEditable={true}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={onMetaAndEnter}
              // disabled={true}
            ></input>
            <button
              id="sendMessage"
              className="font-coolvetica"
              onClick={() => {
                sendMessage();
              }}
            >
              <i className="fa fa-paper-plane pl-2 pr-2"></i>
            </button>
          </div>
        )}
        <div className="font-coolvetica text-xs pt-1 text-ellipsis">
          Connected as:
          {wallet.address != undefined
            ? " " +
              wallet.address.substring(0, 12) +
              "....." +
              wallet.address.substring(
                wallet.address.length - 12,
                wallet.address.length
              )
            : "-"}
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
