import { track } from '@/app/utils/analytics';

describe('analytics sanitization', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (window as any).plausible = undefined;
  });

  test('redacts email and filename and paths and truncates long strings', () => {
    const mock = jest.fn();
    (window as any).plausible = mock;

    const long = 'A'.repeat(500);
    const props = {
      email: 'alice@example.com',
      filename: 'secret.pdf',
      unixPath: '/home/alice/private/data.txt',
      windowsPath: 'C:\\Users\\Alice\\secret.txt',
      longText: long,
      nested: { foo: 'bar' },
    } as any;

    track('Sanitize Test', props);

    expect(mock).toHaveBeenCalledTimes(1);
    const calledProps = mock.mock.calls[0][1];
    expect(calledProps).toBeDefined();
    const sanitized = calledProps.props;
    expect(sanitized.email).toBe('[redacted]');
    expect(sanitized.filename).toBe('[redacted]');
    expect(sanitized.unixPath).toBe('[redacted_path]');
    expect(sanitized.windowsPath).toBe('[redacted_path]');
    expect(typeof sanitized.longText).toBe('string');
    // Truncated long text should end with ellipsis character
    expect(sanitized.longText.endsWith('…')).toBe(true);
    // nested object should be stringified and sanitized
    expect(typeof sanitized.nested).toBe('string');
    expect(sanitized.nested.includes('foo')).toBe(true);
  });
});
