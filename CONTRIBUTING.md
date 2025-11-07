# Contributing to Simple Toolkit

Thank you for your interest in Simple Toolkit! This project is **open source for transparency**, allowing anyone to verify our privacy and security claims.

## Purpose of Open Source

This repository exists primarily for:
- **Transparency**: Anyone can verify files are processed locally in the browser
- **Security Auditing**: Community can review code for vulnerabilities
- **Trust Building**: Users can confirm privacy claims by reading the source
- **Bug Reporting**: Help us identify and fix issues

**We encourage contributions to improve the main application** rather than creating separate forks or deployments.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Why it would be valuable
- Any implementation ideas (optional)

### Pull Requests

We welcome pull requests that improve the main application! Before submitting:

1. **Open an issue first** to discuss significant changes
2. **Follow the existing code style** - run `npm run lint` before committing
3. **Write tests** for new functionality (see `__tests__/` directory)
4. **Update documentation** if needed
5. **Keep commits atomic** and write clear commit messages
6. **Ensure all tests pass** - run `npm test`

**Note**: We're looking for contributions to enhance the main app at simpletoolkit.app. If you're planning to deploy your own version, we recommend using the official app and contributing improvements back to the community.

#### Development Setup (For Verification & Contributing)

```bash
# Clone the repository (or your fork if contributing code)
git clone https://github.com/punq/simpletoolkit.git
cd simpletoolkit

# Install dependencies
npm install

# Start development server (verify the app runs as described)
npm run dev

# Run tests (verify test coverage and behavior)
npm test

# Run linter
npm run lint
```

#### Code Guidelines

- **Security First**: All file processing must happen client-side only
- **Privacy by Default**: Never transmit user files to servers
- **Accessibility**: Follow ARIA guidelines and semantic HTML
- **Performance**: Optimize for large files, use web workers where appropriate
- **TypeScript**: Use strict typing, avoid `any`
- **Error Handling**: Provide user-friendly error messages
- **File Validation**: Always validate file types and sizes
- **Input Sanitization**: Sanitize all user inputs (filenames, etc.)

#### Component Structure

Tools should follow this pattern:
```tsx
"use client";
// 1. Imports
// 2. Type definitions
// 3. Component with:
//    - Input validation
//    - Error handling
//    - Loading states
//    - Accessibility attributes
//    - Analytics tracking
```

#### Testing

- Write unit tests for utility functions
- Write component tests for UI interactions
- Test error cases and edge conditions
- Mock pdf-lib for faster tests

### Architecture Decisions

- **No Server Processing**: All PDF operations use `pdf-lib` in the browser
- **No External Dependencies**: Avoid adding unnecessary packages
- **Privacy Analytics**: Only use Plausible (cookie-less, privacy-first)
- **Static Export**: Site should be deployable as static files

## Verification & Auditing

You can verify our privacy and security claims by:
- Running the app locally and inspecting network traffic (no uploads should occur)
- Reviewing the source code in `/app` directories
- Running tests with `npm test` to see expected behavior
- Checking `package.json` for minimal, vetted dependencies

## Questions?

Open an issue or discussion if you have questions about the project, want to verify functionality, or propose improvements!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
