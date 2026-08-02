import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import DocsHub from './DocsHub';

vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playSwell: vi.fn()
  }
}));

describe('DocsHub Progressive Chapter Documentation Reader', () => {
  const renderDocs = () => {
    return render(
      <MemoryRouter>
        <DocsHub />
      </MemoryRouter>
    );
  };

  it('renders Documentation Hub header and initial Chapter 1 by default', () => {
    renderDocs();

    expect(screen.getByText('Space-Clocker Manuals')).toBeInTheDocument();
    expect(screen.getByText('1. Clocking In Your Mental Space')).toBeInTheDocument();
    expect(screen.getByText(/Core Axiom/i)).toBeInTheDocument();
  });

  it('navigates through chapters sequentially using pagination buttons', async () => {
    renderDocs();

    // Click Chapter 2 button
    const nextBtns = screen.getAllByRole('button', { name: /2\. Orbit Daily Flight Planning/i });
    fireEvent.click(nextBtns[0]);

    expect(await screen.findByText('Step-by-Step Flight Planning')).toBeInTheDocument();
  });

  it('switches to Developer Manual tab and displays environment setup', async () => {
    renderDocs();

    const devTabBtn = screen.getByRole('button', { name: /Developer Manual/i });
    fireEvent.click(devTabBtn);

    expect(await screen.findByText('1. Environment Setup & Prerequisites')).toBeInTheDocument();
    expect(screen.getByText('Terminal Onboarding Steps')).toBeInTheDocument();
  });
});
