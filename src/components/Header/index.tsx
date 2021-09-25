import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <a>
            <img src="/spacetraveling.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
