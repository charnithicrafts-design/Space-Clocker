import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SkillsMatrix from './SkillsMatrix';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import React from 'react';

const mockSkills = [ { id: "skill-1", name: "React Mastery", currentProficiency: 80, targetProficiency: 100, recommendation: "Study React 19 concurrent features.", type: "personal" }, { id: "skill-2", name: "AWS Cloud Practitioner", currentProficiency: 40, targetProficiency: 90, recommendation: "Complete the SAA-C03 course.", type: "ambition", ambitionId: "ambition-1" } ];

const mockConfig = { apiKey: "mock-key", model: "gemini-1.5-pro", providerUrl: "mock-url" };

// Mock dependencies
vi.mock('../../store/useTrackStore');
vi.mock('../../utils/SoundManager');


const mockAmbitions = [
  { id: 'ambition-1', title: 'Cloud Architect Path', progress: 20 },
];

describe('SkillsMatrix', () => {
  const mockAddSkill = vi.fn();
  const mockUpdateSkill = vi.fn();
  const mockDeleteSkill = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      skills: mockSkills,
      ambitions: mockAmbitions,
      oracleConfig: mockConfig,
      addSkill: mockAddSkill,
      updateSkill: mockUpdateSkill,
      deleteSkill: mockDeleteSkill,
      preferences: { confirmDelete: false },
    });
  });

  it('should render the Skills Matrix with core proficiency headers', () => {
    render(<SkillsMatrix />);
    expect(screen.getByText('Stellar Matrix')).toBeInTheDocument();
    expect(screen.getByText('Technical Proficiency')).toBeInTheDocument();
  });

  it('should render all skills in "All Sectors" view', () => {
    render(<SkillsMatrix />);
    // Use getAllByText because it appears in Radar Chart and Skill Card
    expect(screen.getAllByText('React Mastery').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AWS Cloud Practitioner').length).toBeGreaterThan(0);
  });

  it('should filter skills by "Personal Track"', async () => {
    render(<SkillsMatrix />);
    const personalButton = screen.getByText('Personal Track');
    fireEvent.click(personalButton);

    await waitFor(() => {
      expect(screen.getAllByText('React Mastery').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('AWS Cloud Practitioner').length).toBe(0);
    });
  });

  it('should filter skills by ambition category', async () => {
    render(<SkillsMatrix />);
    const ambitionButton = screen.getByText('Cloud Architect Path');
    fireEvent.click(ambitionButton);

    await waitFor(() => {
      expect(screen.queryAllByText('React Mastery').length).toBe(0);
      expect(screen.getAllByText('AWS Cloud Practitioner').length).toBeGreaterThan(0);
    });
  });

  it('should toggle target proficiency in radar chart', () => {
    render(<SkillsMatrix />);
    const targetToggle = screen.getByText('Target');
    fireEvent.click(targetToggle);
    expect(targetToggle).toBeInTheDocument();
  });

  it('should allow adding a new skill to a category', async () => {
    render(<SkillsMatrix />);
    // Switch to Personal Track to enable "Add Skill" button
    fireEvent.click(screen.getByText('Personal Track'));
    
    // Use findByText to wait for the button to appear if it's animated
    const addButton = await screen.findByText('Add Skill');
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText('Skill Name (e.g. Astro-Navigation)');
    const recInput = screen.getByPlaceholderText('Gap analysis recommendation...');
    
    fireEvent.change(nameInput, { target: { value: 'TypeScript' } });
    fireEvent.change(recInput, { target: { value: 'Learn utility types.' } });
    
    const submitButton = screen.getByText('Uplink Skill');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddSkill).toHaveBeenCalledWith('TypeScript', 0, 100, 'Learn utility types.', 'personal', undefined);
      expect(SoundManager.playPop).toHaveBeenCalled();
    });
  });

  it('should allow editing an existing skill', async () => {
    render(<SkillsMatrix />);
    
    // Target the skill card specifically
    const skillCards = screen.getAllByText('React Mastery');
    // The h4 is usually the second one (first is SVG tspan)
    const skillHeading = skillCards.find(el => el.tagName === 'H4');
    const skillCard = skillHeading?.closest('div')?.parentElement;
    
    const editButton = skillCard?.querySelector('button'); // First button is Edit3
    if (editButton) fireEvent.click(editButton);

    const nameInput = await screen.findByDisplayValue('React Mastery');
    fireEvent.change(nameInput, { target: { value: 'React 19' } });
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdateSkill).toHaveBeenCalledWith('skill-1', expect.objectContaining({ name: 'React 19' }));
      expect(SoundManager.playPop).toHaveBeenCalled();
    });
  });

  it('should allow deleting a skill', async () => {
    render(<SkillsMatrix />);
    
    const skillCards = screen.getAllByText('React Mastery');
    const skillHeading = skillCards.find(el => el.tagName === 'H4');
    const skillCard = skillHeading?.closest('div')?.parentElement;
    
    const deleteButton = skillCard?.querySelectorAll('button')[1]; // Second button is Trash2
    if (deleteButton) fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteSkill).toHaveBeenCalledWith('skill-1');
      expect(SoundManager.playThud).toHaveBeenCalled();
    });
  });
});
