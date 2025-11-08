'use client';
import Link from 'next/link';
import styles from './MainNav.module.css';

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
          <Link className={styles.btn} href="/account">Войти</Link>
        </div>
      </div>
      <div className={styles.separator}/>
    </header>
  );
}
