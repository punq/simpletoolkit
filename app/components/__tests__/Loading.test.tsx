import React from 'react';
import { render } from '@testing-library/react';
import Loading from '@/app/components/Loading';

describe('Loading', () => {
  it('renders loading elements', () => {
    const { container } = render(<Loading />);
    expect(container.querySelectorAll('.loading').length).toBeGreaterThan(0);
  });
});
