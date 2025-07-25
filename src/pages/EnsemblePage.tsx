import { useParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styles from './EnsemblePage.module.css';
import emptyPostsImg from '../assets/posts-empty@2x.jpg';
import BurgerMenu from '../components/Menu';

type Ensemble = {
  _id: string;
  title: string;
  description: string;
  contactPerson: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  posts?: {
    _id: string;
    title: string;
    instrument: string;
  }[];
};

const EnsemblePage = () => {
  const { id } = useParams({ from: '/ensembles/$id' });
  const navigate = useNavigate();
  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);

  useEffect(() => {
    const fetchEnsemble = async () => {
      const res = await fetch(`http://localhost:3000/ensembles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEnsemble({ ...data, posts: data.posts || [] });
      }
    };
    fetchEnsemble();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm('Er du sikker på, at du vil slette ensemblet?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/ensembles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      navigate({ to: '/' });
    } else {
      alert('Noget gik galt under sletning.');
    }
  };

  if (!ensemble) return <p>Indlæser ensemble...</p>;

  return (
     <>
      <BurgerMenu />
    <main className={styles.page}>
      {/* 🎵 Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>{ensemble.title}</h1>
        {/* <p className={styles.location}>8000 Aarhus C</p> */}
      </header>

      {/* 📝 Description */}
      <section className={styles.section}>
        <h2>Beskrivelse</h2>
        <p className={styles.text}>{ensemble.description}</p>
      </section>

      {/* 👤 Contact Person */}
      <section className={styles.section}>
        <h2>Kontaktperson</h2>
        <p>
          {ensemble.contactPerson.firstName} {ensemble.contactPerson.lastName}
        </p>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => navigate({ to: `/profile/${ensemble.contactPerson._id}` })}
            className={styles.outlineButton}
          >
            Vis profil
          </button>
          <button onClick={handleDelete} className={styles.dangerButton}>
            Slet ensemble
          </button>
        </div>
      </section>

      {/* 📢 Posts */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Aktuelle opslag</h2>
          <button
            className={styles.smallButton}
            onClick={() => navigate({ to: `/ensembles/${id}/create-post` })}
          >
            Opret
          </button>
        </div>

        {(ensemble.posts || []).length === 0 ? (
          <div className={styles.emptyBox}>
            <img src={emptyPostsImg} alt="Ingen opslag" className={styles.emptyImage} />
            <p className={styles.noText}>Ingen opslag</p>
            <p className={styles.helper}>Ingen opslag for dette ensemble endnu.</p>
          </div>
        ) : (
          <ul className={styles.postList}>
            {ensemble.posts!.map((post) => (
              <li
                key={post._id}
                className={styles.postCard}
                onClick={() => navigate({ to: `/posts/${post._id}` })}
                style={{ cursor: 'pointer' }}
              >
                <p className={styles.postTitle}>{post.title}</p>
                <span className={styles.instrument}>{post.instrument}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
    </>
  );
};

export default EnsemblePage;
