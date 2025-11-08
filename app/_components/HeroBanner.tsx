'use client';
import styles from './HeroBanner.module.css';
import Link from 'next/link';
import { CountdownTimer } from '@/components/CountdownTimer';

const FEATURE_TIMER = process.env.NEXT_PUBLIC_FEATURE_HERO_TIMER === 'true';
const PROMO_DEADLINE = process.env.PROMO_DEADLINE;

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.box}>
          <div className={styles.content}>
            <h1 className={styles.title}>Новогодняя акция</h1>
            <p className={styles.subtitle}>
              Каждая покупка — шанс на iPhone 17 Pro
              {FEATURE_TIMER && PROMO_DEADLINE && (
                <>
                  <br />
                  <CountdownTimer
                    deadline={PROMO_DEADLINE}
                    className="inline-block mt-2 text-brand-gold"
                  />
                </>
              )}
            </p>
            <Link href="/draws" className={styles.cta}>Участвовать</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
