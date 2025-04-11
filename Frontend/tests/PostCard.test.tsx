import React from 'react';
import { render } from '@testing-library/react-native';
// eslint-disable-next-line import/no-unresolved
import PostCard from '@/app/components/PostCard';

const mockPost = {
  id: '123',
  title: 'Titre du post',
  description: 'Description du post.',
  imageList: ['https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg'],
  poster: {
    username: 'OS_XIV',
    avatarUrl: 'https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg',
    teamName: 'OS Team',
    isVerified: true,
  },
  likes: 10,
  reposts: 3,
  comments: [],
};

describe('PostCard', () => {
  it('affiche le titre et la description', () => {
    const { getByText } = render(<PostCard {...mockPost} />);
    expect(getByText('Titre du post')).toBeTruthy();
    expect(getByText('Description du post.')).toBeTruthy();
  });

  it('affiche le nom d’utilisateur et le nom de l’équipe', () => {
    const { getByText } = render(<PostCard {...mockPost} />);
    expect(getByText('OS_XIV')).toBeTruthy();
    expect(getByText('[OS Team]')).toBeTruthy();
  });

  it('affiche l’icône ✔ si l’utilisateur est vérifié', () => {
    const { getByText } = render(<PostCard {...mockPost} />);
    expect(getByText('✔')).toBeTruthy();
  });

  it('affiche l’image si une image est présente', () => {
    const { getAllByRole } = render(<PostCard {...mockPost} />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThan(0);
  });
});
