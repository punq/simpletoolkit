import React from 'react';
import { render } from '@testing-library/react';
import TrackView from '@/app/components/TrackView';

jest.mock('@/app/utils/analytics', () => ({
  track: jest.fn(),
}));

const { track } = require('@/app/utils/analytics');

describe('TrackView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('calls track with event and props', () => {
    render(<TrackView event="ViewTest" props={{ view: 'test' }} />);
    expect(track).toHaveBeenCalledWith('ViewTest', { view: 'test' });
  });

  it('does not call track when event empty', () => {
    render(<TrackView event={""} />);
    expect(track).not.toHaveBeenCalled();
  });
});
