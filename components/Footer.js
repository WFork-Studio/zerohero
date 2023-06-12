import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <div className="font-coolvetica w-screen pl-8 pr-4 md:pr-10 lg:pr-0 md:pl-32 pt-8 pb-8 bg-[#2F3030] self-stretch [clip-path:polygon(0%_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(7em_0,100%_0,100%_100%,0_100%)]">
      <div className="lg:grid lg:grid-cols-4 items-start">
        <div className="w-full self-center pl-7 pb-2 grid grid-cols-2 lg:block">
          <img
            className="img-alert"
            src="/images/begamble.png"
            alt="Be Gamble"
          />
          <div>
            <div className="mt-1 text-base md:text-xl pl-1 text-white">
              {t("footer_content.community_social")}
            </div>
            <div className="flex flex-row pl-1 pt-1">
              <a href="https://linktr.ee/trainersnfts" target="_blank">
                <img
                  src="/images/telegram.png"
                  className="mr-3 h-5 lg:h-7"
                  alt="Telegram"
                />
              </a>
              <a href="https://twitter.com/ZeroHeroNFTs" target="_blank">
                <img
                  src="/images/twitter.png"
                  className="mr-3 h-5 lg:h-7"
                  alt="Twitter"
                />
              </a>
              <a href="https://discord.gg/6W3B6a3wgK" target="_blank">
                <img
                  src="/images/discord.png"
                  className="mr-3 h-5 lg:h-7"
                  alt="Discord"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="flex pb-2 col-span-2">
          <div className="w-full pl-7 xl:pl-3 self-center">
            <div className="mt-1 text-2xl lg:text-lg xl:text-2xl 2xl:text-4xl text-white">
              {t("footer_content.zerohero_title")}
            </div>
            <p className="mt-1 text-xs 2xl:text-base text-[#A5A5A5]">
              {t("footer_content.zerohero_desc")}
            </p>
          </div>

          <div className="w-full pl-7 lg:pl-16 xl:pl-28 2xl:pl-44 self-center">
            <div className="mt-1 text-2xl lg:text-4xl text-white">
              {t("footer_content.support")}
            </div>
            <a href="https://linktr.ee/trainersshop" target="_blank">
              <div className="text-xs lg:text-base text-[#A5A5A5]">
                {t("footer_content.buy_trainers")}
              </div>
            </a>
            <a href="https://linktr.ee/trainersshop" target="_blank">
              <div className="text-xs lg:text-base text-[#A5A5A5]">
                {t("footer_content.buy_zerohero")}
              </div>
            </a>
          </div>
        </div>

        <div className="pl-7 self-center">
          <div className="flex items-center">
            <div className="mt-1 text-2xl font-coolveticaCondensed pr-3 text-white">
              {t("footer_content.available_on")}:
            </div>
            <img
              className="w-10"
              width={100}
              height={100}
              src="/images/sui_brand_text.png"
            />
          </div>
          <div className="text-xs lg:text-base text-[#A5A5A5] font-coolvetica">
            {t("footer_content.mwlb")} WFS
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
