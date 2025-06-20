import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import styles from './Register.module.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/edit-profile/$id' });

  // 🧠 Access current logged-in user, token, and the setUser method from context
  const { user: loggedInUser, setUser, token } = useUser();

  // 📝 Local form state to hold values being edited
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    profileText: '',
    profilePhoto: null as File | null,
  });

  // ⚠️ Validation error messages for inputs
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
  });

  // ⏳ Controls loading screen when fetching user data
  const [loading, setLoading] = useState(true);

  // 🔄 Populate form with user data on page load
  useEffect(() => {
    if (loggedInUser && loggedInUser._id === id) {
      // ✅ Use user data from context if editing your own profile
      setForm({
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
        profileText: loggedInUser.profileText || '',
        profilePhoto: null,
      });
      setLoading(false);
    } else {
      // 🌐 Fallback: fetch user data from server
      const fetchUser = async () => {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            profileText: data.profileText || '',
            profilePhoto: null,
          });
        } else {
          alert('Kunne ikke hente brugerdata');
        }
        setLoading(false);
      };

      fetchUser();
    }
  }, [id, loggedInUser, token]);

  // 🛡 If user tries to access another user's edit page
  if (loggedInUser && loggedInUser._id !== id) {
    return <p>Du har ikke adgang til at redigere denne profil.</p>;
  }

  // 🖊 Handle typing in text inputs and textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 📸 Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(prev => ({ ...prev, profilePhoto: e.target.files![0] }));
    }
  };

  // 💾 Form submission: validate and update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Step 1: Validate required fields
    const newErrors = {
      firstName: form.firstName.trim() === '' ? 'Fornavn er påkrævet' : '',
      lastName: form.lastName.trim() === '' ? 'Efternavn er påkrævet' : '',
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(e => e !== '')) return;

    // ✅ Step 2: Update text data
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        profileText: form.profileText,
      }),
    });

    if (!res.ok) {
      alert('Noget gik galt under opdatering.');
      return;
    }

    // 👤 Update user in context with fresh data
    const updatedUser = await res.json();
    setUser(updatedUser);

    // ✅ Step 3: Upload profile picture separately (if any)
    if (form.profilePhoto) {
      const imageData = new FormData();
      imageData.append('file', form.profilePhoto);

      const photoRes = await fetch('http://localhost:3000/users/upload-profile-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageData,
      });

      if (photoRes.ok) {
        const result = await photoRes.json();

        // ✅ Add/overwrite profilePhoto in context
        setUser({
          ...updatedUser,
          profilePhoto: result.filePath,
        });
      } else {
        alert('Billedet blev ikke uploadet korrekt.');
      }
    }

    // ✅ Redirect to profile page
    navigate({ to: `/profile/${id}` });
  };

  if (loading) return <p>Indlæser profil...</p>;

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Rediger profil</h1>

        {/* 👤 First name input */}
        <section className={styles.field}>
          <label htmlFor="firstName">Fornavn</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.firstName || ' '}</p>
        </section>

        {/* 👤 Last name input */}
        <section className={styles.field}>
          <label htmlFor="lastName">Efternavn</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.lastName || ' '}</p>
        </section>

        {/* 📝 Profile text */}
        <section className={styles.field}>
          <label htmlFor="profileText">Profiltekst</label>
          <textarea
            id="profileText"
            name="profileText"
            value={form.profileText}
            onChange={handleChange}
            rows={4}
          />
        </section>

        {/* 📸 Profile photo upload */}
        <section className={styles.field}>
          <label htmlFor="profilePhoto">Profilbillede</label>
          <input
            type="file"
            id="profilePhoto"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
        </section>

        {/* 💾 Save button */}
        <button type="submit">Gem ændringer</button>
      </form>
    </main>
  );
};

export default EditProfile;
