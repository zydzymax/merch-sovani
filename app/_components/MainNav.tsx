'use client';
import Link from 'next/link';
import { CartBadge } from '@/components/CartBadge';
import styles from './MainNav.module.css';

const FEATURE_STICKY = process.env.NEXT_PUBLIC_FEATURE_STICKY_HEADER === 'true';

export default function MainNav() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>SoVAni Shop</Link>
        <nav className={styles.nav}>
          <Link href="/">Главная</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/draws">Розыгрыши</Link>
          <Link href="/promo">Акция</Link>
        </nav>
        <div className={styles.tools}>
          <input className={styles.search} placeholder="Поиск…" />
          {FEATURE_STICKY && <CartBadge className={styles.cart} />}
          {FEATURE_STICKY ? (
            <Link className={styles.ctaBtn} href="/catalog">К покупкам</Link>
          ) : (
            <Link className={styles.btn} href="/account">Войти</Link>
          )}
        </div>
      </div>
      <div className={styles.separator}/>
    </header>
  );
}
