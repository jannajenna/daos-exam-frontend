import { useParams } from '@tanstack/react-router';
//import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import placeholderImg from '../assets/profile-placeholder.svg';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  profileText?: string;
  ensembles: string[];
  posts: string[];
};

const Profile = () => {
  const { id } = useParams({ from: '/profile/$id' });

  // 👇 Later: enable this fetch when backend is ready
  /*
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        alert('Kunne ikke hente brugerdata');
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <p>Indlæser...</p>;
  */

  // ✅ Hardcoded example user data
  const user: User = {
    _id: id,
    firstName: 'Susanne',
    lastName: 'N',
    profileText:
      'Jeg har spillet i 7 år på både musikskole og højskole. Min gamle gruppe jeg har spillet med spiller ikke længere, og nu har jeg endelig fået mere fritid til at spille mere.\n\nJeg har både erfaring fra et stort orkester og et mindre ensemble.\n\nNu er jeg mest interesseret i at komme i gang med at spille igen, så alt har interesse.',
    ensembles: ['Århus Klassisk Ensemble'],
    posts: ['Violinist søges som afløser til forestilling i oktober'],
  };
  return (
    <main className={styles.page}>
      {/* 👤 Header Info */}
      <header className={styles.header}>
        <img src={placeholderImg} alt="Profil" className={styles.avatar} />
        <div>
          <h2 className={styles.name}>
            {user.firstName} {user.lastName}.
          </h2>
          <p className={styles.meta}>Medlem siden Maj 2020</p>
          <p className={styles.meta}>Sidst logget ind 1 time siden</p>
        </div>
      </header>

      <button className={styles.editButton}>Rediger profil</button>

      <hr className={styles.divider} />

      {/* 📝 Profile Text */}
      <section className={styles.block}>
        <h3>Profiltekst</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{user.profileText}</p>
      </section>

      <hr className={styles.divider} />

      {/* 🎻 Ensembles */}
      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h3>Mine ensembler</h3>
          <button className={styles.smallButton}>Opret</button>
        </div>
        <ul className={styles.list}>
          {user.ensembles.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <hr className={styles.divider} />

      {/* 📢 Posts */}
      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h3>Mine opslag</h3>
          <button className={styles.smallButton}>Opret</button>
        </div>
        <ul className={styles.list}>
          {user.posts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Profile;
