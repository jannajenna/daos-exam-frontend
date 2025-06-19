import { useNavigate } from '@tanstack/react-router';
import styles from './Landing.module.css';
import heroImage from '../assets/hero-illustration.svg';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Musik Samspil</h1>
        <p className={styles.subtitle}>Skabt af DAOS - Dansk Amatørorkester Samvirke</p>
      </header>

      <img src={heroImage} alt="Hero" className={styles.heroImage} />

      <h2 className={styles.headline}>
        Stedet hvor musikere finder musikere og spiller musik sammen
      </h2>

      <section className={styles.cta}>
        <p className={styles.text}>
          Log ind for at finde musikere du kan spille med i hele Danmark
        </p>

        <button
          className={styles.primaryButton}
          onClick={() => navigate({ to: '/register' })}
        >
          Opret med e-mail
        </button>

        <span className={styles.divider}>eller</span>

        <button
          className={styles.secondaryButton}
          onClick={() => navigate({ to: '/login' })}
        >
          Log ind
        </button>
      </section>
    </main>
  );
};

export default Landing;

