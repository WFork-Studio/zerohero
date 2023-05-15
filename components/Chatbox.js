import React, { useState, useEffect, useRef } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import io from "socket.io-client";

export default function Chatbox() {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);
  const [message, setMessage] = useState("");
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const wallet = useWallet();
  let error = null;

  const [room, setRoom] = useState("zerohero_chatbox");
  const socket = io("http://192.168.49.21:4001", { autoConnect: true });
  useEffect(() => {
    if (wallet.address === undefined) {
      console.log("Wallet is undefined");

      socket.on("connect", async () => {
        socket.on("latestMessage", (last100Messages) => {
          console.log("Last 100 messages: ", JSON.parse(last100Messages));
          last100Messages = JSON.parse(last100Messages);
          // Sort these messages by __createdtime__
          last100Messages = sortMessagesByDate(last100Messages);
          setMessagesReceived((state) => [...last100Messages, ...state]);
        });
      });
      setUserAuthenticated(false);
    } else {
      console.log("Wallet available, ready to connect!");
      socket.on("connect", async () => {
        console.log(`[SOCKET] Successfully Connected as ${socket.id}!`);

        if (userAuthenticated == false) {
          await socket.emit("authentication", {
            contractAddress: wallet.address,
          });
        }
        socket.on("authenticated", () => {
          socket.emit("joinRoom", {
            contractAddress: wallet.address,
            room,
          });
          socket.on("latestMessage", (last100Messages) => {
            console.log("Last 100 messages: ", JSON.parse(last100Messages));
            last100Messages = JSON.parse(last100Messages);
            // Sort these messages by __createdtime__
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state) => [...last100Messages, ...state]);
          });
          console.log(`${wallet.address} has joined the room.`);
        });
      });
    }

    return () => socket.close();
  }, [wallet]);

  useEffect(() => {
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
  }, [socket]);

  const sendMessage = () => {
    if (message !== "") {
      console.log("sending message");
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("sendMessage", {
        contractAddress: wallet.address,
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
        <div className="rounded-[8px] rounded-bl-[0px] h-auto break-all w-full bg-[#121212] back p-2">
          <span className="text-blue-500">{message.contractAddress}:</span>{" "}
          <span>{message.message}</span>
        </div>
      </div>
    </div>
  );

  // useEffect(() => {
  //   // Last 100 messages sent in the chat room (fetched from the db in backend)
  //   socket.on("latestMessage", (last100Messages) => {
  //     console.log("Last 100 messages: ", JSON.parse(last100Messages));
  //     last100Messages = JSON.parse(last100Messages);
  //     // Sort these messages by __createdtime__
  //     last100Messages = sortMessagesByDate(last100Messages);
  //     setMessagesReceived((state) => [...last100Messages, ...state]);
  //   });

  //   return () => socket.off("last100Messages");
  // }, [socket]);

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
      // element.querySelector(">i").style.display = "none";
      element.classList.add("expand");
      element.querySelector(".chat").classList.add("enter");
      // var strLength = textInput.value.length * 2;
      // if (wallet.address !== undefined) {
      //   // textInput.addEventListener("keydown", onMetaAndEnter);
      //   element
      //     .querySelector("#sendMessage")
      //     .addEventListener("click", sendNewMessage);
      // }
      element.removeEventListener("click", openElement);
      element
        .querySelector(".header button")
        .addEventListener("click", closeElement);
      // messages.scrollTop(messages.prop("scrollHeight"));
    }

    function closeElement() {
      element.querySelector(".chat").classList.remove("enter");
      // element.querySelector(">i").show();
      element.classList.remove("expand");
      element
        .querySelector(".header button")
        .removeEventListener("click", closeElement);
      // element
      //   .querySelector("#sendMessage")
      //   .removeEventListener("click", sendNewMessage);
      // element
      //   .querySelector(".text-box")
      //   .removeEventListener("keydown", onMetaAndEnter);
      // .prop("disabled", true)
      // .trigger("blur");
      setTimeout(function () {
        element.querySelector(".chat").classList.remove("enter");
        element.addEventListener("click", openElement);
      }, 500);
    }
  }, []);
  // function sendNewMessage() {
  //   var userInput = document.querySelector(".text-box");
  //   var newMessage = userInput
  //     .html()
  //     .replace(/\<div\>|\<br.*?\>/gi, "\n")
  //     .replace(/\<\/div\>/g, "")
  //     .trim()
  //     .replace(/\n/g, "<br>");

  //   if (!newMessage) return;

  //   var messagesContainer = document.querySelector(".messages");

  //   messagesContainer.insertAdjacentHTML(
  //     "beforeend",
  //     ['<li class="self">', newMessage, "</li>"].join("")
  //   );

  //   userInput.html("");
  //   userInput.trigger("focus");

  //   messagesContainer.finish().animate(
  //     {
  //       scrollTop: messagesContainer.prop("scrollHeight"),
  //     },
  //     250
  //   );
  // }
  // function pasteIntoInput(el, text) {
  //   el.focus();
  //   if (
  //     typeof el.selectionStart == "number" &&
  //     typeof el.selectionEnd == "number"
  //   ) {
  //     var val = el.value;
  //     var selStart = el.selectionStart;
  //     el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd);
  //     el.selectionEnd = el.selectionStart = selStart + text.length;
  //   } else if (typeof document.selection != "undefined") {
  //     var textRange = document.selection.createRange();
  //     textRange.text = text;
  //     textRange.collapse(false);
  //     textRange.select();
  //   }
  // }
  // function onMetaAndEnter(evt) {
  // if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
  // sendNewMessage();
  // form.submit();
  // }
  //   if (evt.keyCode == 13 && evt.shiftKey) {
  //     if (evt.type == "keypress") {
  //       pasteIntoInput(this, "\n");
  //     }
  //     evt.preventDefault();
  //   }
  // }
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

        {wallet.address === undefined ? (
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
            <input
              className="text-box"
              // contentEditable={true}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              // onKeyDown={onMetaAndEnter}
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
