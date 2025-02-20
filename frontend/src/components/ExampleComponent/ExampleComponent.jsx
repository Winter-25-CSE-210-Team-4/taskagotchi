import { useState } from 'react';
import PropTypes from 'prop-types';

const ExampleComponent = ({ onSubmit }) => {
  const initFormInput = 'empty';
  const [formInput, setFormInput] = useState(initFormInput);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formInput);
    setFormInput('empty');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid='form-input-element'
        type='text'
        value={formInput}
        onChange={(e) => setFormInput(e.target.value)}
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

ExampleComponent.propTypes = {
  onSubmit: PropTypes.func,
};
export default ExampleComponent;
