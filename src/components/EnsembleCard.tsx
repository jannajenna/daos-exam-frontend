import { Link } from '@tanstack/react-router';
import styles from './EnsembleCard.module.css';

type Props = {
  ensemble: {
    _id: string;
    title: string;
    posts?: unknown[]; // You don’t need post content anymore
  };
};

const EnsembleCard = ({ ensemble }: Props) => {
  const postCount = ensemble.posts?.length ?? 0;
  const preview = postCount > 0
    ? `Har ${postCount} opslag`
    : 'Ingen opslag endnu';

  return (
    <Link to={`/ensembles/${ensemble._id}`} className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.ensemble}>{ensemble.title}</h2>
      </div>

      <p className={styles.title}>{preview}</p>

      <div className={styles.footer}>
        <span className={styles.experience}>{postCount}+</span>
      </div>
    </Link>
  );
};

export default EnsembleCard;
