# Contributing to Secure Share Hub

Thank you for your interest in contributing to Secure Share Hub! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- Report bugs and issues
- Suggest new features or enhancements
- Improve documentation
- Submit pull requests for bug fixes or features
- Write tests to improve coverage
- Review pull requests

## 🐛 Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When creating a bug report, include:
- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser, etc.)

## 💡 Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Clearly describe the feature and its benefits
- Explain how it aligns with the project's goals
- Provide examples or mockups if possible

## 🔧 Development Setup

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x
- Git

### Setup Instructions

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/secure-share-hub.git
   cd secure-share-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Configure Environment**
   Create `.env` files (see README.md for details)

4. **Start Development Servers**
   ```bash
   npm run dev:full
   ```

5. **Run Tests**
   ```bash
   # Frontend tests
   npm test

   # Backend tests
   cd server && npm test
   ```

## 📝 Coding Guidelines

### General Principles
- Write clean, readable, and maintainable code
- Follow existing code style and patterns
- Keep functions small and focused
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed

### TypeScript Guidelines
- Use TypeScript strictly - avoid `any` types
- Define proper interfaces and types
- Use type inference where appropriate
- Export types that may be reused

### React Guidelines
- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop types
- Follow existing naming conventions
- Use Tailwind CSS for styling

### Backend Guidelines
- Follow MVC architecture pattern
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all user inputs
- Add rate limiting for sensitive endpoints

### Testing Guidelines
- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

## 🔀 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Follow the coding guidelines
   - Add or update tests as needed
   - Update documentation if necessary

3. **Test Your Changes**
   ```bash
   # Run linters
   npm run lint

   # Run tests
   npm test
   cd server && npm test && cd ..

   # Build the project
   npm run build:full
   ```

4. **Commit Your Changes**
   Use clear, descriptive commit messages:
   ```bash
   git commit -m "feat: add file preview functionality"
   git commit -m "fix: resolve authentication token expiry issue"
   git commit -m "docs: update API documentation"
   git commit -m "test: add tests for file upload validation"
   ```

   Commit message prefixes:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Test additions or changes
   - `refactor:` - Code refactoring
   - `style:` - Code style changes (formatting, etc.)
   - `chore:` - Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with:
     - Clear description of changes
     - Related issue numbers (if applicable)
     - Testing performed
     - Screenshots (for UI changes)
   - Submit the pull request

7. **Code Review**
   - Address reviewer feedback
   - Make requested changes
   - Push updates to the same branch
   - PR will be merged once approved

## 🧪 Testing Requirements

All contributions should include appropriate tests:

### Frontend
- Component tests for new UI components
- Integration tests for new features
- Update existing tests if behavior changes

### Backend
- Unit tests for utilities and helpers
- Integration tests for API endpoints
- Test both success and error scenarios

### Coverage
- Aim for 80%+ code coverage
- Don't sacrifice quality for coverage
- Focus on critical paths and edge cases

## 📖 Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Modifying API endpoints
- Updating configuration options

Documentation to consider:
- README.md
- API documentation
- Code comments
- JSDoc for functions
- Environment variable documentation

## 🔒 Security

- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for secrets
- Report security vulnerabilities privately
- Follow security best practices
- Review code for potential vulnerabilities

## 📋 PR Checklist

Before submitting your PR, ensure:
- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm test` and `cd server && npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build:full`)
- [ ] New code has appropriate tests
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No sensitive data is included
- [ ] PR description is complete

## ❓ Questions?

If you have questions:
- Check existing documentation
- Search existing issues
- Open a new issue for discussion
- Tag maintainers if urgent

## 🙏 Thank You!

Your contributions help make Secure Share Hub better for everyone. We appreciate your time and effort!

## 📜 Code of Conduct

Be respectful and inclusive. We're all here to learn and improve together.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
