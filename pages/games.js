import styles from "../styles/Home.module.css";

export default function Games(statsDatas) {
  return (
    <section className="font-coolvetica h-screen">
      <div className={styles.container}>
        <div className="text-white text-6xl py-5">
          Game
          <br /> List
        </div>
        <div className="flex items-center pt-3">
          <a href="/coin-flip">
            <img className="pr-5" src="/images/flipcoin.png" alt="Flip Coin" />
          </a>

          <a href="/catchem-all">
            <img
              className="pr-5"
              src="/images/catchemall.png"
              alt="Catch'em All"
            />
          </a>
          <img className="pr-5" src="/images/dice.png" alt="Dice" />
          <img
            className="pr-5"
            src="/images/rps.png"
            alt="Rock Paper Scissors"
          />
        </div>
      </div>
    </section>
  );
}
