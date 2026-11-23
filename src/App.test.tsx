import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostCard, { FeedPost } from './Components/PostCard';

const post: FeedPost = {
  id: 42,
  titulo: 'Meu projeto',
  descricao: 'Um projeto visual.',
  data: '2026-01-15 12:00:00',
  autor: 'Ana',
  imagens: ['imagens/primeira.png', 'imagens/segunda.png'],
};

test('exibe as imagens, descrição, autoria e link da publicação', () => {
  render(<MemoryRouter><PostCard post={post} /></MemoryRouter>);
  expect(screen.getByText('Um projeto visual.')).toBeInTheDocument();
  expect(screen.getByText('Ana')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /imagem 1/ })).toHaveAttribute('src', '/api/imagens/primeira.png');
  expect(screen.getByRole('img', { name: /imagem 2/ })).toHaveAttribute('src', '/api/imagens/segunda.png');
  expect(screen.getByRole('link', { name: /ver publicação/i })).toHaveAttribute('href', '/post/42');
});

test('preserva publicações antigas sem imagem e não cria link na página de detalhe', () => {
  render(<MemoryRouter><PostCard post={{ ...post, imagens: [] }} detailed /></MemoryRouter>);
  expect(screen.getByText('Meu projeto')).toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /ver publicação/i })).not.toBeInTheDocument();
});
