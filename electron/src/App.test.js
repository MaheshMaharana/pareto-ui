import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from "react-router-dom";

test('renders learn react link', () => {
  render(<BrowserRouter> <App /> </BrowserRouter>);
  
});
