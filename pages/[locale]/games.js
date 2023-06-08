import styles from "../../styles/Home.module.css";
import Link from "../../components/Link";
import Footer from "../../components/Footer";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getStaticPaths, makeStaticProps } from '../../lib/getStatic'

export default function Games(statsDatas) {
  const { t } = useTranslation('common');
  return (
    <>
      <section className="font-coolvetica h-screen pb-7">
        <div className={styles.container}>
          <div className="text-white text-6xl py-5">
          {t('landing_content.game_list')}
          </div>
          <div className="grid grid-cols-2 lg:flex items-center pt-3">
            <Link href="/coin-flip">
              <img className="lg:pr-5 p-4 w-full" src="/images/flipcoin.png" alt="Flip Coin" />
            </Link>

            <Link href="/catchem-all">
              <img
                className="lg:pr-5 p-4 w-full"
                src="/images/catchemall.png"
                alt="Catch'em All"
              />
            </Link>
            <Link href="/games">
              <img className="lg:pr-5 p-4 w-full" src="/images/dice.png" alt="Dice" />
            </Link>
            <Link href="/games">
              <img
                className="lg:pr-5 p-4 w-full"
                src="/images/rps.png"
                alt="Rock Paper Scissors"
              />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

const getStaticProps = makeStaticProps(['common'])
export { getStaticPaths, getStaticProps }

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common']))
//     }
//   };
// }