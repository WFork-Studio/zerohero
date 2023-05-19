import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Games(statsDatas) {
  return (
    <section className="font-coolvetica h-screen pb-7">
      <div className={styles.container}>
        <div className="text-white text-6xl py-5">
          Game
          <br /> List
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
  );
}
