# Nebula Mobile Actions Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile usability on the Nebula screen by replacing hover-only action buttons with a touch-friendly "Actions Menu" (three-dot menu) across Ambitions, Milestones, and Tasks.

**Architecture:** Refactor `src/components/nebula/NebulaMap.tsx` to include a reusable `ActionMenu` component that handles dropdown visibility and "click outside" behavior. Replace existing `group-hover` buttons with this menu.

**Tech Stack:** React 19, Framer Motion, Lucide React, Tailwind CSS.

---

### Task 1: Implement Reusable `ActionMenu` Component

**Files:**
- Modify: `src/components/nebula/NebulaMap.tsx`

- [ ] **Step 1: Add `MoreVertical` to imports**

```typescript
import { MoreVertical, ChevronDown, CheckCircle, ... } from 'lucide-react';
```

- [ ] **Step 2: Define `ActionMenu` sub-component**
Create this component inside `NebulaMap.tsx` (or as a separate file if preferred, but keeping it local for now matches existing style).

```tsx
const ActionMenu = ({ actions }: { actions: { label: string; icon: any; onClick: (e: React.MouseEvent) => void; variant?: 'default' | 'error' }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-surface-high rounded-lg transition-colors text-on-surface-variant hover:text-white"
        title="Actions"
      >
        <MoreVertical size={16} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-36 glass-panel border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={(e) => {
                  setIsOpen(false);
                  action.onClick(e);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors hover:bg-surface-high ${action.variant === 'error' ? 'text-error hover:bg-error/10' : 'text-white'}`}
              >
                <action.icon size={14} />
                <span>{action.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### Task 2: Update `AmbitionCard` to use `ActionMenu`

**Files:**
- Modify: `src/components/nebula/NebulaMap.tsx`

- [ ] **Step 1: Locate `AmbitionCard` and replace hover buttons**
Find the `group/title` div and replace the buttons with `ActionMenu`.

```tsx
<div className="flex items-center gap-3 group/title">
  <h1 className={`${isPriority ? 'text-2xl' : 'text-lg'} font-display font-bold text-white mt-1`}>{ambition.title}</h1>
  <div className="mt-1 lg:opacity-0 lg:group-hover/title:opacity-100 transition-all">
    <ActionMenu 
      actions={[
        { label: 'Edit', icon: Edit2, onClick: startEditingAmbition },
        { label: 'Abort', icon: Trash2, onClick: handleDeleteAmbition, variant: 'error' }
      ]} 
    />
  </div>
</div>
```

- [ ] **Step 2: Remove old hover-trigger CSS**
Ensure `opacity-0 group-hover/title:opacity-100` is removed so the menu is always visible (or at least accessible via tap).

### Task 3: Update `MilestoneCard` (Milestone level) to use `ActionMenu`

**Files:**
- Modify: `src/components/nebula/NebulaMap.tsx`

- [ ] **Step 1: Update Milestone header in `MilestoneCard`**
Find the milestone title section and replace buttons.

```tsx
<div className="flex items-center gap-2 group">
  <span className="font-bold text-white">{milestone.title}</span>
  <div className="ml-auto lg:opacity-0 lg:group-hover:opacity-100 transition-all">
    <ActionMenu 
      actions={[
        { label: 'Edit', icon: Edit2, onClick: startEditingMilestone },
        { label: 'Collapse', icon: Trash2, onClick: handleDeleteMilestone, variant: 'error' }
      ]} 
    />
  </div>
</div>
```

Note: Using `lg:opacity-0 lg:group-hover:opacity-100` keeps it hidden on desktop until hover, but `opacity-100` (default) on smaller screens ensures it's always visible for touch.

### Task 4: Update Task Items in `MilestoneCard` to use `ActionMenu`

**Files:**
- Modify: `src/components/nebula/NebulaMap.tsx`

- [ ] **Step 1: Update Task items list in `MilestoneCard`**
Find the task item rendering and replace the edit/delete buttons.

```tsx
{!task.completed && editingTaskId !== task.id && (
  <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-all">
    <ActionMenu 
      actions={[
        { label: 'Edit', icon: Edit2, onClick: (e) => startEditingTask(e, task) },
        { label: 'Extract', icon: Trash2, onClick: (e) => handleDeleteTask(e, task.id), variant: 'error' }
      ]} 
    />
  </div>
)}
```

### Task 5: Update Tests and Verify

**Files:**
- Modify: `src/components/nebula/NebulaMap.test.tsx`

- [ ] **Step 1: Update task deletion test**
The tests might need to click the menu button before finding the delete button, or use a different selector since the structure changed.

```typescript
it('should handle milestone task deletion (Act/Assert)', async () => {
  render(<NebulaMap />);
  fireEvent.click(screen.getByText('Atmospheric Scrubber Installation'));
  
  // 1. Find and click the Action Menu trigger for the task
  const actionMenus = screen.getAllByTitle('Actions');
  // First menu is milestone, subsequent are tasks. 
  // Better: find menu within the task container.
  const taskContainer = screen.getByText('Verify O2 output').closest('div');
  const menuTrigger = taskContainer?.querySelector('button[title="Actions"]');
  if (menuTrigger) fireEvent.click(menuTrigger);

  // 2. Click "Extract" in the dropdown
  const extractButton = screen.getByText('Extract');
  fireEvent.click(extractButton);

  expect(mockDeleteMilestoneTask).toHaveBeenCalledWith('ambition-alpha', 'milestone-1', 'task-2');
});
```

- [ ] **Step 2: Run tests**
Run: `npm test src/components/nebula/NebulaMap.test.tsx`
Expected: PASS

- [ ] **Step 3: Manual Verification**
If possible, check on mobile or responsive view in browser. Verify that the menu icon is visible and functional on narrow screens.
