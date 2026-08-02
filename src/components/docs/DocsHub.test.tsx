import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import DocsHub from './DocsHub';

// Mock SoundManager
vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playSwell: vi.fn()
  }
}));

describe('DocsHub In-App Documentation Component', () => {
  const renderDocs = () => {
    return render(
      <MemoryRouter>
        <DocsHub />
      </MemoryRouter>
    );
  };

  it('renders the Documentation Hub title and default User Guide tab', () => {
    renderDocs();

    expect(screen.getByText('Space-Clocker Manuals')).toBeInTheDocument();
    expect(screen.getByText('Clocking In Your Mental Space')).toBeInTheDocument();
    expect(screen.getByText('1. Clock In Your Mental Space')).toBeInTheDocument();
    expect(screen.getByText('2. Adding & Scheduling Daily Tasks')).toBeInTheDocument();
  });

  it('switches to Developer Guide tab when clicked', async () => {
    renderDocs();

    const devTabBtn = screen.getByRole('button', { name: /Developer Guide/i });
    fireEvent.click(devTabBtn);

    expect(await screen.findByText('Developer Onboarding & AI Collaboration')).toBeInTheDocument();
    expect(screen.getByText('1. Environment Setup & Prerequisites')).toBeInTheDocument();
    expect(screen.getByText('2. Local-First WASM Architecture')).toBeInTheDocument();
    expect(screen.getByText('4. AI CLI (Antigravity / AGY) & Agent Team Collaboration')).toBeInTheDocument();
  });

  it('filters guide cards when typing into the search input', () => {
    renderDocs();

    const searchInput = screen.getByPlaceholderText('Search guides...');
    fireEvent.change(searchInput, { target: { value: 'Recalibrate' } });

    expect(screen.getByText('6. Void Protocol & [⚡ Recalibrate]')).toBeInTheDocument();
    expect(screen.queryByText('2. Adding & Scheduling Daily Tasks')).not.toBeInTheDocument();
  });
});
