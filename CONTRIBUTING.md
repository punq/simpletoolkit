# Contributing to Simple Toolkit

Thank you for considering contributing to Simple Toolkit! We welcome contributions from the community.

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

1. **Fork the repository** and create a new branch for your feature/fix
2. **Follow the existing code style** - run `npm run lint` before committing
3. **Write tests** for new functionality (see `__tests__/` directory)
4. **Update documentation** if needed
5. **Keep commits atomic** and write clear commit messages
6. **Ensure all tests pass** - run `npm test`

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/simpletoolkit.git
cd simpletoolkit

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
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

## Questions?

Open an issue or discussion if you have questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
