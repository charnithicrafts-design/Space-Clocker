import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from './NotFoundPage';

vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
  }
}));

describe('NotFoundPage 404 Component', () => {
  it('renders lost in deep space title and return to home button', () => {
    render(
      <MemoryRouter initialEntries={['/rou']}>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Lost in Deep Space?')).toBeInTheDocument();
    expect(screen.getByText('/rou')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Back/i })).toBeInTheDocument();
  });
});
