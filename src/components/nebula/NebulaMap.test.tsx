import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NebulaMap from './NebulaMap';

describe('NebulaMap', () => {
  it('renders milestones correctly when available', () => {
    render(<NebulaMap />);
    
    // Check for milestone titles from seeded store data
    expect(screen.getByText('Life Support Calibration')).toBeInTheDocument();
    expect(screen.getByText('Biometric Dome Shielding')).toBeInTheDocument();
  });

  it('toggles milestone task expansion', async () => {
    render(<NebulaMap />);
    
    const milestone = screen.getByText('Life Support Calibration');
    
    // Expand
    fireEvent.click(milestone.parentElement!.parentElement!);
    
    // Verify task is visible
    expect(screen.getByText('Calibrate O2 levels')).toBeInTheDocument();
  });
});
