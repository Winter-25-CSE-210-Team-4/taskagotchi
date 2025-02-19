import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExampleComponent from './ExampleComponent';
import PropTypes from 'prop-types';

const mockedSubmit = vi.fn();

//TODO: Add mock service call

// Mocking the component so that you can build with what every props you want
const MockExampleComponent = ({ onSubmit }) => {
  return <ExampleComponent onSubmit={onSubmit} />;
};

// Interface for mocked component
MockExampleComponent.propTypes = {
  onSubmit: PropTypes.func,
};

//** integration test: service calls on dashboard */
describe('Loading example component', () => {
  it('should with inital input', async () => {
    render(<MockExampleComponent onSubmit={vi.fn()} />);
    const input = await screen.findByTestId('form-input-element');
    // check for initial render
    expect(input).toBeInTheDocument();
    // check for value
    expect(input.value).toBe('empty');
  });

  it('should reset input value to empty when form is submitted', async () => {
    const user = userEvent.setup();
    render(<MockExampleComponent onSubmit={vi.fn()} />);

    // check inital state
    const input = await screen.findByTestId('form-input-element');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('empty');

    // change input value
    fireEvent.change(input, { target: { value: 'T-ask' } });
    expect(input.value).toBe('T-ask');

    // clicks button, handles state afterwards
    const button = screen.getByRole('button');
    user.click(button);
    await waitFor(() => {
      expect(input.value).toBe('empty');
    });
  });
});
