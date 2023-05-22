import React, { useState, useEffect, useRef } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { io } from "socket.io-client";

export default function Chatbox() {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);
  const [message, setMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const wallet = useWallet();
  let error = null;
  // const [socket, setSocket] = useState([]);

  var socket = io("http://192.168.49.21:4000", {
    autoConnect: true,
  });

  useEffect(() => {
    // setMessagesReceived([]);
    if (wallet.address === undefined) {
      socket = io("http://192.168.49.21:4000", {
        autoConnect: true,
        // query: {
        //   tempUid: createUUID(),
        // },
      });

      socket.on("latestMessage", (last10Messages) => {
        console.log("Last 10 messages: ", JSON.parse(last10Messages));
        last10Messages = JSON.parse(last10Messages);
        // Sort these messages by __createdtime__
        last10Messages = sortMessagesByDate(last10Messages);
        setMessagesReceived((state) => [...last10Messages, ...state]);
      });
    } else {
      setWalletAddress(wallet.address);

      socket = io("http://192.168.49.21:4000", {
        autoConnect: true,
        query: {
          walletAddress: wallet.address,
        },
      });

      //Getting User Data
      socket.on("userData", (userData) => {
        console.log(userData);
      });

      // //Join A Room
      // socket.emit("joinRoom", {
      //   walletAddress: wallet.address,
      //   room,
      // });

      //Getting Latest Message
      socket.on("latestMessage", (last10Messages) => {
        console.log("Last 10 messages: ", JSON.parse(last10Messages));
        last10Messages = JSON.parse(last10Messages);
        // Sort these messages by __createdtime__
        last10Messages = sortMessagesByDate(last10Messages);
        setMessagesReceived((state) => [...last10Messages, ...state]);
      });

      socket.on("receiveMessage", (data) => {
        console.log("Received: " + data);
        setMessagesReceived((state) => [
          ...state,
          {
            message: data.message,
            walletAddress: data.walletAddress,
            __createdtime__: data.__createdtime__,
          },
        ]);
      });

      console.log(`[USER] Connected to wallet address ${wallet.address}`);
      // getSocket();
    }
  }, [wallet]);

  // useEffect(() => {
  //   socket.on("receiveMessage", (data) => {
  //     console.log("Received: " + data);
  //     setMessagesReceived((state) => [
  //       ...state,
  //       {
  //         message: data.message,
  //         walletAddress: data.walletAddress,
  //         __createdtime__: data.__createdtime__,
  //       },
  //     ]);
  //   });

  //   return () => socket.off("receiveMessage");
  // }, [socket]);

  const sendMessage = () => {
    if (message !== "") {
      console.log("sending message from  " + wallet.address + " " + message);
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("sendMessage", {
        walletAddress: wallet.address,
        message,
        __createdtime__,
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
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
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
      <i className="fa fa-comments" style={{fontSize:'1.25em'}} aria-hidden="true"></i>
      <div className="chat">
        <div className="header">
          <span className="title font-coolvetica">
            Chat and Notification Box
          </span>
          <button>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <ul
          className="messages font-coolvetica text-sm"
          ref={messagesColumnRef}
        >
          {messagesRecieved.map((msg, i) => (
            <ChatBubble message={msg} key={i} />
          ))}
        </ul>

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
          {" " +
            walletAddress.substring(0, 12) +
            "....." +
            walletAddress.substring(
              walletAddress.length - 12,
              walletAddress.length
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
