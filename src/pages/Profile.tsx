import { useParams, useNavigate } from '@tanstack/react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import placeholderImg from '../assets/profile-placeholder.svg';
import EnsembleCard from '../components/EnsembleCard';
import PostCard from '../components/PostCard';

// 🧩 User type based on backend response structure
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  profileText?: string;
  profilePhoto?: string;
  ensembles: {
    _id: string;
    title: string;
    posts?: unknown[];
  }[];
  posts: {
    _id: string;
    title: string;
    instrument?: string;
    ensemble?: {
      title: string;
      city?: string;
    };
  }[];
};

const Profile = () => {
  const { id } = useParams({ from: '/profile/$id' }); // 🔐 Extract user ID from route
  const navigate = useNavigate();
  const { user: loggedInUser, token } = useUser(); // 🔑 Get logged-in user and token from context

  const [user, setUser] = useState<User | null>(null); // 🧠 Local state to store profile being viewed
  const [loading, setLoading] = useState(true); // ⏳ Show loading while fetching user

  const isOwnProfile = loggedInUser?._id === id; // 🧪 Determine if user is viewing their own profile

  // 🔄 Fetch the user data (protected route — requires Authorization header)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Auth token:", token);
        const res = await fetch(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Required for protected route
          },
        });

        if (!res.ok) throw new Error('Kunne ikke hente brugerdata');

        const data = await res.json();
        setUser(data); // ✅ Save to state
      } catch {
        alert('Noget gik galt ved hentning af profil.');
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchUser();
  }, [id, token]);

  // ⏳ Show loading UI
  if (loading) return <p>Indlæser profil...</p>;
  if (!user) return <p>Bruger blev ikke fundet.</p>;

  return (
    <main className={styles.page}>
      {/* 👤 Header: Profile image, name, info */}
      <header className={styles.header}>
        <img
          src={user.profilePhoto ? `http://localhost:3000${user.profilePhoto}` : placeholderImg}
          alt="Profil"
          className={styles.avatar}
        />

        <div>
          <h2 className={styles.name}>
            {user.firstName} {user.lastName}
          </h2>
          <p className={styles.meta}>Medlem siden Maj 2020</p>
          <p className={styles.meta}>Sidst logget ind 1 time siden</p>
        </div>
      </header>

      {/* 🛠 Rediger profil knap kun for eget profil */}
      {isOwnProfile && (
        <button
          className={styles.editButton}
          onClick={() => navigate({ to: `/edit-profile/${id}` })}
        >
          Rediger profil
        </button>
      )}

      <hr className={styles.divider} />

      {/* 📝 Profiltekst */}
      <section className={styles.block}>
        <h3>Profiltekst</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{user.profileText}</p>
      </section>

      <hr className={styles.divider} />

      {/* 🎻 Mine ensembler */}
      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h3>Mine ensembler</h3>
          {isOwnProfile && (
            <button
              className={styles.smallButton}
              onClick={() => navigate({ to: '/ensembles/create' })}
            >
              Opret
            </button>
          )}
        </div>

        {/* Empty state or list of ensembles */}
        {user.ensembles.length === 0 ? (
          <p className={styles.helper}>Ingen ensembler endnu</p>
        ) : (
          <ul className={styles.list}>
            {user.ensembles.map((ensemble) => (
              <li key={ensemble._id}>
                <EnsembleCard ensemble={ensemble} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr className={styles.divider} />

      {/* 📢 Mine opslag */}
      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h3>Mine opslag</h3>
          {isOwnProfile && (
            <button className={styles.smallButton}>Opret</button>
          )}
        </div>

        {/* Empty state or list of posts */}
        {user.posts.length === 0 ? (
          <p className={styles.helper}>Ingen opslag endnu</p>
        ) : (
          <ul className={styles.list}>
            {user.posts.map((post) => (
              <li key={post._id}>
                <PostCard
                  _id={post._id}
                  title={post.title}
                  instrument={post.instrument ?? 'Ukendt'}
                  ensemble={post.ensemble?.title ?? 'Ukendt ensemble'}
                  city={post.ensemble?.city ?? 'Uden by'}
                  experience="Erfaring ikke angivet"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Profile;
