import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoalForm from './GoalForm';
import PropTypes from 'prop-types';

// Mocking the component so that you can build with what every props you want
const MockGoalForm = ({ onSubmit }) => {
  return <GoalForm onSubmit={onSubmit} />;
};

// Interface for mocked component
MockGoalForm.propTypes = {
  onSubmit: PropTypes.func,
};

describe('GoalForm Component', () => {
  it('should render initial input elements', async () => {
    render(<MockGoalForm onSubmit={vi.fn()} />);
    const nameInput = await screen.findByTestId('form-input-name-element');
    const descriptionInput = await screen.findByTestId(
      'form-input-description-element'
    );
    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('should show error messages when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<MockGoalForm onSubmit={vi.fn()} />);
    const submitButton = screen.getByRole('button', { name: /create goal/i });
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Missing Name!')).toBeInTheDocument();
      expect(screen.getByText('Missing Description!')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data when form is filled and submitted', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<MockGoalForm onSubmit={mockSubmit} />);
    const nameInput = await screen.findByTestId('form-input-name-element');
    const descriptionInput = await screen.findByTestId(
      'form-input-description-element'
    );
    const submitButton = screen.getByRole('button', { name: /create goal/i });

    await user.type(nameInput, 'New Goal');
    await user.type(descriptionInput, 'Goal Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Goal',
          description: 'Goal Description',
          completed: false,
          endDate: expect.any(Number),
        })
      );
    });
  });

  it('should submitted form text data should be trimmed for leading and ending spaces', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<MockGoalForm onSubmit={mockSubmit} />);
    const nameInput = await screen.findByTestId('form-input-name-element');
    const descriptionInput = await screen.findByTestId(
      'form-input-description-element'
    );
    const submitButton = screen.getByRole('button', { name: /create goal/i });

    await user.type(nameInput, '  New Goal  ');
    await user.type(descriptionInput, '  Goal Description  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Goal',
          description: 'Goal Description',
          completed: false,
          endDate: expect.any(Number),
        })
      );
    });
  });

  it('should reset input values after form submission', async () => {
    const user = userEvent.setup();
    render(<MockGoalForm onSubmit={vi.fn()} />);
    const nameInput = await screen.findByTestId('form-input-name-element');
    const descriptionInput = await screen.findByTestId(
      'form-input-description-element'
    );
    const submitButton = screen.getByRole('button', { name: /create goal/i });

    await user.type(nameInput, 'New Goal');
    await user.type(descriptionInput, 'Goal Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });
});
