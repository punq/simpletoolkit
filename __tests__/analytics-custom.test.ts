import { track } from '@/app/utils/analytics';

describe('analytics - custom tests', () => {
  beforeEach(() => {
    // clear any existing global plausible
    (global as any).plausible = undefined;
  });

  it('passes empty props object through to plausible', () => {
    const mock = jest.fn();
    (global as any).plausible = mock;

    track('Empty Props', {});

    expect(mock).toHaveBeenCalledWith('Empty Props', { props: {} });
  });

  it('sanitizes strings (emails, paths) and truncates long strings', () => {
    const mock = jest.fn();
    (global as any).plausible = mock;

    const long = 'a'.repeat(400);
    track('Sanitize', { email: 'alice@example.com', path: 'C:\\secret\\file.txt', long });

    const calls = (mock as jest.Mock).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const last = calls[calls.length - 1];
    expect(last[0]).toBe('Sanitize');
    const props = last[1]?.props ?? {};

    expect(props.email).toBe('[redacted]');
    expect(props.path).toBe('[redacted_path]');
    expect(typeof props.long).toBe('string');
    // truncated to MAX_STRING_LENGTH (200) plus ellipsis makes <= 201
    expect((props.long as string).length).toBeLessThanOrEqual(201);
  });
});
