import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src="/spacetraveling.svg" alt="SpaceTraveling - Blog" />
      </div>
    </header>
  );
}
