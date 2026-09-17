# Contributing to TruthGuard AI - Honest Eye

Thank you for your interest in contributing to TruthGuard AI! This project aims to combat misinformation in India through AI-powered analysis and education.

## 🚀 How to Contribute

### 🐛 Reporting Bugs
- Use the GitHub issue tracker
- Provide clear steps to reproduce
- Include environment details
- Add screenshots if applicable

### 💡 Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature's purpose and benefits
- Consider the Indian context and localization needs
- Discuss implementation approach

### 🔧 Code Contributions

#### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose
- Google Cloud API key
- Basic understanding of React, TypeScript, and Express

#### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd honest-eye-app-main

# Install dependencies
npm install
cd backend && npm install && cd ..

# Configure environment
cp backend/.env.example backend/.env
# Add your Google API key to backend/.env

# Start development servers
npm run dev          # Frontend
cd backend && npm run dev  # Backend
```

#### Pull Request Process
1. **Fork & Branch**: Create a feature branch from `main`
2. **Code**: Follow existing code style and patterns
3. **Test**: Ensure all tests pass and add new ones
4. **Document**: Update README and inline documentation
5. **Commit**: Use clear, descriptive commit messages
6. **PR**: Create pull request with detailed description

#### Code Standards
- **TypeScript**: Use strict typing
- **React**: Functional components with hooks
- **Express**: RESTful API design
- **Security**: Follow OWASP guidelines
- **Performance**: Optimize for mobile devices

#### Testing Guidelines
- Write unit tests for new functions
- Test API endpoints thoroughly
- Verify mobile responsiveness
- Test with various misinformation patterns

### 🌍 Localization
We welcome contributions for:
- Indian language support
- Regional misinformation patterns
- Local trusted news sources
- Cultural context improvements

### 📚 Documentation
Help improve:
- Code comments and inline documentation
- User guides and tutorials
- API documentation
- Deployment instructions

## 🎯 Priority Areas

### High Priority
- **Accuracy Improvements**: Better scoring algorithms
- **Indian Context**: Regional patterns and sources
- **Performance**: Faster analysis and loading
- **Security**: Enhanced protection measures

### Medium Priority
- **New Features**: Additional analysis types
- **UI/UX**: Better user experience
- **Integrations**: Third-party services
- **Analytics**: Usage and effectiveness metrics

### Low Priority
- **Optimizations**: Code refactoring
- **Documentation**: Enhanced guides
- **Testing**: Additional test coverage
- **Accessibility**: Better a11y support

## 📝 Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
Scopes: `frontend`, `backend`, `api`, `ui`, `docs`, `deploy`

Examples:
- `feat(api): add WhatsApp bot integration`
- `fix(ui): resolve mobile responsiveness issues`
- `docs(readme): update installation instructions`

## 🔒 Security Guidelines

### Sensitive Data
- Never commit API keys or secrets
- Use environment variables
- Follow principle of least privilege
- Sanitize all user inputs

### API Security
- Implement rate limiting
- Validate all requests
- Use HTTPS in production
- Enable CORS properly

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn
- Celebrate diverse perspectives

### Communication
- Use clear, descriptive language
- Be patient with questions
- Provide helpful code reviews
- Share knowledge generously

## 📞 Getting Help

### Development Questions
- Open a GitHub discussion
- Tag maintainers in issues
- Join our community chat

### Technical Issues
- Check existing issues first
- Provide minimal reproduction cases
- Include environment details
- Follow issue templates

## 🏆 Recognition
Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Given credit in documentation
- Invited to project discussions

## 📜 License
By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping build a more informed India! 🇮🇳**