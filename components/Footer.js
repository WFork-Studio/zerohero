export default function Footer() {
  return (
    <div className="font-coolvetica w-screen pl-32 pt-8 pb-8 bg-[#2F3030] self-stretch [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]">
      <div className="flex items-start">
        <div className="column-3xs self-center w-[20%] ">
          <img src="/images/begamble.png" alt="Be Gamble" />
          <div className="mt-1 text-xl pl-1">Our Community and Social</div>
          <div className="flex flex-row pl-1 pt-1">
            <a href="#">
              <img
                src="/images/telegram.png"
                className="mr-3 h-7"
                alt="Telegram"
              />
            </a>
            <a href="#">
              <img
                src="/images/twitter.png"
                className="mr-3 h-7"
                alt="Twitter"
              />
            </a>
            <a href="#">
              <img
                src="/images/discord.png"
                className="mr-3 h-7"
                alt="Discord"
              />
            </a>
          </div>
        </div>

        <div className="column-3xs pl-7 w-[30%]">
          <div className="mt-1 text-4xl">ZeroHero</div>
          <div className="mt-1 text-md text-[#A5A5A5]">
            Please research if ZeroHero is legal to use in your jurisdiction
            prior to use. ZeroHero assumes no responsibility for your use of the
            platform. This platform has 5% rake. ZeroHero is a decentralized
            protocol and the maintainers of this interface are not responsible
            for any losses or damages incurred by using this interface.
          </div>
        </div>

        <div className="column-3xs pl-7 w-[20%]">
          <div className="mt-1 text-4xl">Support</div>
          <a href="#">
            <div className="mt-1 text-lg text-[#A5A5A5]">Buy Lucky Charm</div>
          </a>
          <a href="#">
            <div className="mt-1 text-lg text-[#A5A5A5]">Buy Card ID</div>
          </a>
          <a href="#">
            <div className="mt-1 text-lg text-[#A5A5A5]">ZeroHero Stats</div>
          </a>
          <a href="#">
            <div className="mt-1 text-lg text-[#A5A5A5]">Game Responsibly</div>
          </a>
        </div>

        <div className="column-3xs pl-7 w-[30%] self-center">
          <div className="flex items-center">
            <div className="mt-1 text-2xl font-coolveticaCondensed pr-3">
              AVAILABLE ON:
            </div>
            <img src="images/sui_brand_text.png" />
          </div>
          <div className="text-lg text-[#A5A5A5] font-coolvetica">
            Made with love by WFS
          </div>
        </div>
      </div>
    </div>
  );
}
