import styles from './HeroBanner.module.css';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.box}>
          <div className={styles.content}>
            <h1 className={styles.title}>Новогодняя акция</h1>
            <p className={styles.subtitle}>Больше покупок — больше шансов</p>
            <Link href="/draws" className={styles.cta}>Участвовать</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
