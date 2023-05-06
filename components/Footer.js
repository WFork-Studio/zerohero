export default function Footer() {
  return (
    <div className="font-coolvetica relative">
      <img
        src="/images/footer.png"
        className="block absolute w-screen h-auto "
        alt="Footer"
      />
      <div className="column-3xs absolute ml-40 mt-10 text-white text-xl">
        <img src="/images/begamble.png" alt="Be Gamble" />
        <div className="mt-1 text-2xl">Our Community and Social</div>
        <div className="flex flex-row mt-2">
          <img src="/images/telegram.png" className="mr-3 h-7" alt="Telegram" />
          <img src="/images/twitter.png" className="mr-3 h-7" alt="Twitter" />
          <img src="/images/discord.png" className="mr-3 h-7" alt="Discord" />
        </div>
      </div>
    </div>
  );
}
