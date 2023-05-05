import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Statistics() {
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Statistics
        </p>

        <div className='grid grid-cols-2'>
          <Link
            href="/"
            className={styles.card}>
            <h2>Home &rarr;</h2>
          </Link>

          <Link
            href="/catchem-all"
            className={styles.card}>
            <h2>Catchem All &rarr;</h2>
          </Link>

          <Link
            href="/coin-flip"
            className={styles.card}
          >
            <h2>Coin Flip &rarr;</h2>
          </Link>

          <Link
            href="/statistics"
            className={styles.card}
          >
            <h2>Statistics &rarr;</h2>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
