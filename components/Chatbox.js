import React, { useEffect } from "react";

export default function Chatbox() {
  const ChatBubble = (props) => (
    <div class="mx-auto flex h-auto max-w-screen-sm items-start justify-start pb-1">
      <div class="w-full rounded-[8px] rounded-bl-[0px] bg-gradient-to-r from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] p-0.5">
        <div class="flex rounded-[8px] rounded-bl-[0px] h-full w-full bg-[#121212] back p-2">
          knownaskey: WOI
        </div>
      </div>
    </div>
  );

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
        <ul className="messages font-coolvetica text-sm">
          {/* <div class="mx-auto flex h-auto max-w-screen-sm items-start justify-start">
            <div class="w-full rounded-[8px] rounded-bl-[0px] bg-gradient-to-r from-[#6002BF] via-[#C74CDB] to-[#4C6BDB] p-0.5">
              <div class="flex rounded-[8px] rounded-bl-[0px] h-full w-full bg-[#121212] back p-2">
                knownaskey: WOI
              </div>
            </div>
          </div> */}
          <ChatBubble />
          <ChatBubble />
        </ul>
        <div className="footer">
          <div
            className="text-box"
            contentEditable={true}
            disabled={true}
          ></div>
          <button id="sendMessage" className="font-coolvetica">
            <i className="fa fa-paper-plane pl-2 pr-2"></i>
          </button>
        </div>
        <div className="font-coolvetica text-xs pt-1">
          Connected as: 0x491032190429105daw0491024901
        </div>
      </div>
    </div>
  );
}
