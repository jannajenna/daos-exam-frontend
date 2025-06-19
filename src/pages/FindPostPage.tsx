import { useState } from 'react';
import PostCard from '../components/PostCard';
import styles from './FindPostPage.module.css';

// Type definition for a post
type Post = {
  _id: string;
  ensemble: string;
  city: string;
  title: string;
  instrument: string;
  experience: string;
  createdAt: string; // For sorting
};

const FindPostsPage = () => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // default to newest first

  // 🔄 Later: replace this with fetched posts from API
  const posts: Post[] = [
    {
      _id: '1',
      ensemble: 'Århus Klassisk Ensemble',
      city: 'Aarhus',
      title: 'Violinist søges som afløser til forestilling i oktober',
      instrument: 'Violin',
      experience: '2+',
      createdAt: '2024-06-19T10:00:00Z',
    },
    {
      _id: '2',
      ensemble: 'Sønderjyllands Symfoniorkester',
      city: 'Vejle',
      title: 'Vi mangler en trompetspiller',
      instrument: 'Trompet',
      experience: '1+',
      createdAt: '2024-06-15T09:00:00Z',
    },
    {
      _id: '3',
      ensemble: 'Violin + Klarinet duo',
      city: 'Aarhus',
      title: 'Violinist søger en klarinetspiller til duoprojekt',
      instrument: 'Klarinet',
      experience: '1+',
      createdAt: '2024-06-17T14:00:00Z',
    },
  ];

  // 🔁 Sort posts by createdAt based on selected order
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Find Ensemble</h1>
      <p className={styles.subtitle}>{sortedPosts.length} opslag fra ensembler fundet</p>

      {/* 🔽 Sorting dropdown */}
      <div className={styles.sortBar}>
        <label htmlFor="sort">Sorter efter:</label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Nyeste først</option>
          <option value="asc">Ældste først</option>
        </select>
      </div>

      {/* 🔁 Post list */}
      <div className={styles.list}>
        {sortedPosts.map((post) => (
          <PostCard
            key={post._id}
            _id={post._id}
            ensemble={post.ensemble}
            city={post.city}
            title={post.title}
            instrument={post.instrument}
            experience={post.experience}
          />
        ))}
      </div>

      <button className={styles.moreButton}>Se flere</button>
    </main>
  );
};

export default FindPostsPage;
