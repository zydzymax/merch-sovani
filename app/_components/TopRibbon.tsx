'use client';
import Link from 'next/link';
import styles from './TopRibbon.module.css';

export default function TopRibbon() {
  return (
    <div className={styles.ribbon}>
      <div className={styles.inner}>
        <span className={styles.text}>
          <span className={styles.desktop}>Каждая покупка — это шанс в новогоднем розыгрыше</span>
          <span className={styles.mobile}>Каждая покупка — шанс в розыгрыше</span>
        </span>
        <Link href="/legal/promo-rules" className={styles.link}>Правила</Link>
      </div>
    </div>
  );
}
