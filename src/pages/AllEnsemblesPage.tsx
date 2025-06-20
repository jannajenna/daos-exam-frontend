import { useEffect, useState } from 'react';
import EnsembleCard from '../components/EnsembleCard';
import styles from './FindPostPage.module.css';
import BurgerMenu from '../components/Menu';

type Ensemble = {
  _id: string;
  title: string;
  createdAt?: string;
  posts?: unknown[];
};

const AllEnsemblesPage = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchEnsembles = async () => {
      const res = await fetch('http://localhost:3000/ensembles');
      const data = await res.json();

      // sort by creation date
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? 0).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      setEnsembles(sorted);
    };

    fetchEnsembles();
  }, [sortOrder]);

  return (
    <>
    <BurgerMenu />
    <main className={styles.page}>
      <h1 className={styles.title}>Find Ensemble</h1>
      <p className={styles.subtitle}>{ensembles.length} ensembler fundet</p>

      <div className={styles.sortBar}>
        <label>Sorter efter:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
        >
          <option value="newest">Nyeste først</option>
          <option value="oldest">Ældste først</option>
        </select>
      </div>

      <section className={styles.list}>
        {ensembles.map((ensemble) => (
          <EnsembleCard key={ensemble._id} ensemble={ensemble} />
        ))}
      </section>

      <button className={styles.moreButton}>Se flere</button>
    </main>
    </>
  );
};

export default AllEnsemblesPage;
