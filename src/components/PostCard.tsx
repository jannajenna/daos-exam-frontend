import styles from './PostCard.module.css';
import { useNavigate } from '@tanstack/react-router';

type PostCardProps = {
  _id: string;
  ensemble: string;
  city: string;
  title: string;
  instrument: string;
  experience: string;
};

const PostCard = ({ _id, ensemble, city, title, instrument, experience }: PostCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate({ to: `/posts/${_id}` })}
      role="button"
      tabIndex={0}
    >
      <div className={styles.header}>
        <h3 className={styles.ensemble}>{ensemble}</h3>
        <p className={styles.city}>{city}</p>
      </div>
      <p className={styles.title}>{title}</p>
      <div className={styles.footer}>
        <span className={styles.instrument}>{instrument}</span>
        <span className={styles.experience}>{experience}</span>
      </div>
    </div>
  );
};

export default PostCard;

