import React, { useState, useEffect, useRef } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";

export default function Chatbox({ room, setRoom, socket }) {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);
  const [message, setMessage] = useState("");
  const wallet = useWallet();
  let contractAddress = wallet.address;

  const sendMessage = () => {
    if (message !== "") {
      console.log("sending message");
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("sendMessage", {
        contractAddress,
        room,
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
        <div className="flex rounded-[8px] rounded-bl-[0px] h-auto break-all w-full bg-[#121212] back p-2">
          {message.contractAddress}: {message.message}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    // if (!socket.connected) {
    if (contractAddress !== undefined) {
      console.log(contractAddress);
      socket.emit("joinRoom", { contractAddress, room });
    }
    // }

    socket.on("receiveMessage", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          contractAddress: data.contractAddress,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receiveMessage");
  }, [socket]);

  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on("last100Messages", (last100Messages) => {
      console.log("Last 100 messages: ", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last100Messages");
  }, [socket]);

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

  return (
    <div className="floating-chat">
      <i className="fa fa-comments" aria-hidden="true"></i>
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
          {/* <div className="mx-auto flex h-auto max-w-screen-sm items-start justify-start">
            <div className="w-full rounded-[8px] rounded-bl-[0px] bg-gradient-to-r from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] p-0.5">
              <div className="flex rounded-[8px] rounded-bl-[0px] h-full w-full bg-[#121212] back p-2">
                knownaskey: WOI
              </div>
            </div>
          </div> */}
          {messagesRecieved.map((msg, i) => (
            <ChatBubble message={msg} key={i} />
          ))}
        </ul>

        {contractAddress === undefined ? (
          <div className="footer">
            {/* <button
              className="w-full inline-flex items-center border-0 py-2 items-center justify-center  rounded-md font-coolvetica"
              style={{ backgroundColor: "#00F0FF" }}
            >
              Connect Wallet
            </button> */}
            <div className="w-full">
              <ConnectButton label="Connect Wallet" />
            </div>
          </div>
        ) : (
          <div className="footer">
            <div
              className="text-box"
              contentEditable={true}
              onInput={(e) => setMessage(e.currentTarget.textContent)}
              disabled={true}
            ></div>
            <button
              // id="sendMessage"
              className="font-coolvetica"
              onClick={sendMessage}
            >
              <i className="fa fa-paper-plane pl-2 pr-2"></i>
            </button>
          </div>
        )}
        <div className="font-coolvetica text-xs pt-1 text-ellipsis overflow-hidden">
          Connected as:
          <br />
          {wallet.address}
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
