'use client';
import Link from 'next/link';
import styles from './TopRibbon.module.css';

export default function TopRibbon() {
  return (
    <div className={styles.ribbon}>
      <div className={styles.inner}>
        <span className={styles.text}>
          <span className={styles.desktop}>Бесплатная доставка СДЭК от 3 000 ₽</span>
          <span className={styles.mobile}>Доставка от 3 000 ₽ бесплатно</span>
        </span>
        <Link href="/docs/delivery" className={styles.link}>Подробнее</Link>
      </div>
    </div>
  );
}
