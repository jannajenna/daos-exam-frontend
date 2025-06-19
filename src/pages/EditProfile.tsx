import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styles from './Register.module.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/edit-profile/$id' });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    profileText: '',
    profilePhoto: null as File | null,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
  });

  // Load current user data when page loads
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/auth/profile/${id}`);
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
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(prev => ({ ...prev, profilePhoto: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: form.firstName.trim() === '' ? 'Fornavn er påkrævet' : '',
      lastName: form.lastName.trim() === '' ? 'Efternavn er påkrævet' : '',
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(e => e !== '')) return;

    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('profileText', form.profileText);
    if (form.profilePhoto) {
      formData.append('profilePhoto', form.profilePhoto);
    }

    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      navigate({ to: `/profile/${id}` });
    } else {
      alert('Noget gik galt under opdatering.');
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Rediger profil</h1>

        <section className={styles.field}>
          <label htmlFor="firstName">Fornavn</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Indtast fornavn"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.firstName || ' '}</p>
        </section>

        <section className={styles.field}>
          <label htmlFor="lastName">Efternavn</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Indtast efternavn"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.lastName || ' '}</p>
        </section>

        <section className={styles.field}>
          <label htmlFor="profileText">Profiltekst</label>
          <textarea
            id="profileText"
            name="profileText"
            placeholder="Opdater din beskrivelse"
            value={form.profileText}
            onChange={handleChange}
            rows={4}
          />
        </section>

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

        <button type="submit">Gem ændringer</button>
      </form>
    </main>
  );
};

export default EditProfile;
