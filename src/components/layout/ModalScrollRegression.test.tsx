import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpdateModal from './UpdateModal';
import ConfirmModal from './ConfirmModal';
import CommandModal from './CommandModal';
import VersionHistoryModal from '../settings/VersionHistoryModal';
import SyncConflictModal from '../reflection/SyncConflictModal';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn(),
}));

vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
    playSyncSuccess: vi.fn(),
  },
}));

describe('Small-Screen Portrait Scroll & UpdateModal Accessibility Regressions', () => {
  const mockSetShowUpdateModal = vi.fn();
  const mockPerformSystemUpgrade = vi.fn();
  const mockExportData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      showUpdateModal: true,
      setShowUpdateModal: mockSetShowUpdateModal,
      pendingVersion: '1.11.3',
      performSystemUpgrade: mockPerformSystemUpgrade.mockResolvedValue(undefined),
      exportData: mockExportData.mockResolvedValue(JSON.stringify({ version: '1.11.2' })),
    });
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-backup');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders UpdateModal with viewport-safe modal-backdrop, pinned header/footer, scrollable body, and clean bold formatting', () => {
    const { container } = render(<UpdateModal />);

    // Assert: Viewport-safe backdrop + non-clipping flex frame + constrained dialog + internal scroll body
    expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    expect(container.querySelector('.modal-center-frame')).toBeInTheDocument();
    expect(container.querySelector('.modal-dialog')).toBeInTheDocument();
    expect(container.querySelector('.modal-body-scroll')).toBeInTheDocument();

    // Assert: Literal markdown asterisks **Trajectory Engine** are gone
    expect(screen.queryByText(/\*\*Trajectory Engine\*\*/)).not.toBeInTheDocument();
    expect(screen.getByText('Trajectory Engine')).toBeInTheDocument();

    // Assert: Action CTA is outside the scrolling body in a pinned footer so small portrait viewports cannot trap it
    const scrollBody = container.querySelector('.modal-body-scroll')!;
    const ctaButton = screen.getByRole('button', { name: /Initiate Safety Protocol/i });
    expect(ctaButton).toBeInTheDocument();
    expect(scrollBody.contains(ctaButton)).toBe(false);
  });

  it('allows completing the full UpdateModal flow (Alert -> Backup -> Upgrade -> Success)', async () => {
    vi.useFakeTimers();
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<UpdateModal />);

    // Step 1: Click Initiate Safety Protocol
    fireEvent.click(screen.getByRole('button', { name: /Initiate Safety Protocol/i }));
    expect(screen.getByText(/Backup Status/i)).toBeInTheDocument();

    const upgradeBtn = screen.getByRole('button', { name: /Execute System Jump/i });
    expect(upgradeBtn).toBeDisabled();

    // Step 2: Download backup
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Download Trajectory Backup/i }));
    });
    expect(mockExportData).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Trajectories secured/i)).toBeInTheDocument();

    const enabledUpgradeBtn = screen.getByRole('button', { name: /Execute System Jump/i });
    expect(enabledUpgradeBtn).not.toBeDisabled();

    // Step 3: Execute System Jump
    await act(async () => {
      fireEvent.click(enabledUpgradeBtn);
      await vi.advanceTimersByTimeAsync(2100);
    });

    expect(mockPerformSystemUpgrade).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Jump Successful/i)).toBeInTheDocument();
    expect(screen.queryByText(/\*\*v/)).not.toBeInTheDocument();

    anchorClickSpy.mockRestore();
    vi.useRealTimers();
  });

  it('enforces safe modal-backdrop and modal-center-frame wrappers across Confirm, Command, VersionHistory, and SyncConflict modals', () => {
    const confirmRender = render(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} title="Test" message="Msg" />
    );
    expect(document.body.querySelector('.modal-backdrop .modal-center-frame .modal-dialog-scroll')).toBeInTheDocument();
    confirmRender.unmount();

    const commandRender = render(
      <CommandModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Cmd" placeholder="Hint" />
    );
    expect(commandRender.container.querySelector('.modal-backdrop .modal-center-frame .modal-dialog-scroll')).toBeInTheDocument();
    commandRender.unmount();

    const versionRender = render(<VersionHistoryModal isOpen={true} onClose={vi.fn()} />);
    expect(versionRender.container.querySelector('.modal-backdrop .modal-center-frame .modal-dialog .modal-body-scroll')).toBeInTheDocument();
    versionRender.unmount();

    const syncRender = render(
      <SyncConflictModal isOpen={true} onClose={vi.fn()} onResolve={vi.fn()} />
    );
    expect(syncRender.container.querySelector('.modal-backdrop .modal-center-frame .modal-dialog-scroll')).toBeInTheDocument();
    syncRender.unmount();
  });
});
