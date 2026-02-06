# Contributing to Secure Share Hub

First off, thank you for considering contributing to Secure Share Hub! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Be patient and welcoming
- Be collaborative
- Focus on what is best for the community

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write clear commit messages**
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Ensure all tests pass**
7. **Create a pull request** with a clear title and description

## Development Setup

### Prerequisites

- Node.js 18+ 
- MongoDB 5+
- Git

### Setup Steps

1. Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/secure-share-hub.git
cd secure-share-hub
```

2. Install dependencies:
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

3. Set up environment variables:
```bash
# Copy example files
cp .env.example .env
cp server/.env.example server/.env

# Edit the .env files with your configuration
```

4. Seed the database:
```bash
cd server
npm run seed
cd ..
```

5. Start development servers:
```bash
npm run dev:full
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type - use proper types
- Define interfaces for data structures
- Use meaningful variable and function names

### Code Style

- Follow the existing code style
- Use ESLint - run `npm run lint` before committing
- Use Prettier for formatting (if configured)
- Write self-documenting code with clear names
- Add comments for complex logic

### Frontend Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow React best practices
- Use TypeScript for props and state
- Use shadcn/ui components when available

### Backend Guidelines

- Follow REST API conventions
- Use async/await for asynchronous code
- Handle errors properly with try-catch
- Validate all inputs
- Add appropriate middleware
- Write clear error messages

### Git Commit Messages

Follow these conventions for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality

Add password reset via email with secure tokens

Closes #123
```

```
fix(upload): validate file types on server side

Prevent malicious file uploads by checking MIME types
```

## Testing

### Frontend Tests

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Backend Tests

```bash
cd server

# Run tests
npm test

# Run in watch mode
npm run test:watch
```

### Writing Tests

- Write tests for all new features
- Update tests when modifying existing features
- Aim for >80% code coverage
- Test both success and error cases
- Test edge cases

**Test Structure:**
```typescript
describe('Feature Name', () => {
  describe('Function/Method Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = myFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Documentation

- Update README.md for significant changes
- Update API.md for API changes
- Add JSDoc comments for public functions
- Include code examples where helpful
- Keep documentation up-to-date

## Pull Request Process

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following the guidelines above

3. **Test your changes:**
```bash
# Frontend
npm run test
npm run lint
npm run build

# Backend
cd server
npm test
npm run lint
npm run build
```

4. **Commit your changes:**
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub:
   - Give it a clear title and description
   - Reference any related issues
   - Describe what you changed and why
   - Include screenshots for UI changes
   - Wait for review and respond to feedback

## Review Process

- At least one maintainer must approve PRs
- All CI checks must pass
- Code coverage should not decrease
- Documentation must be updated
- Follow-up on review comments promptly

## Additional Notes

### Project Structure

```
secure-share-hub/
├── .github/              # GitHub Actions workflows
├── src/                  # Frontend source
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and contexts
│   ├── services/       # API services
│   └── test/           # Frontend tests
├── server/              # Backend source
│   ├── src/
│   │   ├── config/     # Configuration
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API routes
│   │   ├── utils/      # Utilities
│   │   └── __tests__/  # Backend tests
│   └── uploads/        # File storage
└── public/             # Static assets
```

### Security

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Follow security best practices
- Report security vulnerabilities privately

### Getting Help

- Check existing issues and documentation
- Ask questions in issue comments
- Join discussions in pull requests
- Be patient and respectful

## Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
