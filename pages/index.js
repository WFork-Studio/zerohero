import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <section className="font-coolvetica">
      <div className={styles.container}>
        <div class="grid grid-cols-2 gap-2 p-3">
          <div class="shadow-lg p-10 rounded-lg row-span-2 content-center">
            <div class="row-span-3 text-white text-7xl py-20">
              <div class="col-span-3">Work is overrated</div>
              <div class="row-span-3 col-span-3">Retire early at</div>
              <div class="row-span-3 col-span-3" style={{ color: "#00F0FF" }}>
                ZeroHero
              </div>
            </div>
          </div>
          <div class="shadow-lg bg-gray-900 text-white text-lg font-bold text-center p-10 rounded-lg">
            2
          </div>
          <div class="shadow-lg bg-gray-900 text-white text-lg font-bold text-center p-10 rounded-lg row-span-2">
            3
          </div>
        </div>
      </div>
    </section>
  );
}
