import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styles from './PostPage.module.css';

// Define post structure (matching backend response)
type Post = {
  _id: string;
  title: string;
  description: string;
  instrument?: string;
  ensemble: {
    _id: string;
    title: string;
    contactPerson: {
      _id: string;
      firstName: string;
      lastName: string;
    };
  };
};

const PostPage = () => {
  const { id } = useParams({ from: '/posts/$id' });
  const [post, setPost] = useState<Post | null>(null);

  // 🔄 Fetch post details on load
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/posts/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPost(data);
      } catch {
        alert('Kunne ikke hente opslaget.');
      }
    };

    fetchPost();
  }, [id]);

  // 📥 Handle user request to join ensemble
  const handleJoin = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Du skal være logget ind for at anmode om at deltage.');
      return;
    }

    const res = await fetch(
      `http://localhost:3000/ensembles/${post?.ensemble._id}/join`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert('Du har anmodet om at deltage i ensemblet!');
    } else {
      const error = await res.json();
      alert(error.message || 'Noget gik galt.');
    }
  };

  // 🔄 Loading state
  if (!post) return <p>Indlæser opslag...</p>;

  return (
    <main className={styles.page}>
      {/* 🎵 Post Title */}
      <h1 className={styles.title}>{post.title}</h1>

      {/* 🎼 Instrument info */}
      {post.instrument && (
        <p className={styles.instrument}>Instrument: {post.instrument}</p>
      )}

      {/* 📄 Description Section */}
      <section className={styles.section}>
        <h2>Beskrivelse</h2>
        <p className={styles.text}>{post.description}</p>
      </section>

      {/* 🎤 Ensemble + Contact Info */}
      <section className={styles.section}>
        <h2>Ensemble</h2>
        <p>{post.ensemble.title}</p>
        <p>
          Kontakt: {post.ensemble.contactPerson.firstName}{' '}
          {post.ensemble.contactPerson.lastName}
        </p>
      </section>

      {/* 🔘 Join Button */}
      <button className={styles.primaryButton} onClick={handleJoin}>
        Anmod om at deltage
      </button>
    </main>
  );
};

export default PostPage;
