# Security Policy

## 🔒 Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in this project, please help us by reporting it responsibly.

### How to Report

1. **Email**: Send details to [osamahamad261981@gmail.com]
2. **GitHub Issue**: Create a private security advisory on GitHub
3. **Do NOT** create a public issue

### What to Include

Please include the following information in your report:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact and severity
- Any suggested fixes or mitigations
- Your contact information for follow-up

### Our Response Process

1. **Acknowledgment**: We'll acknowledge receipt within 48 hours
2. **Investigation**: We'll investigate and validate the vulnerability
3. **Fix Development**: We'll develop and test a fix
4. **Disclosure**: We'll coordinate disclosure with you
5. **Release**: We'll release the fix and security advisory

### Security Best Practices

When using this portfolio:

- Keep dependencies updated regularly
- Use HTTPS in production deployments
- Validate all user inputs on both client and server side
- Monitor for security vulnerabilities in dependencies
- Use environment variables for any sensitive configuration

## 🛡️ Security Measures

This project implements several security measures for a modern React portfolio:

### Frontend Security

- **Content Security Policy**: Implemented through meta tags and secure headers
- **XSS Protection**: React's automatic escaping prevents XSS attacks
- **Input Validation**: Contact form inputs are validated and sanitized
- **Secure External Links**: All external links use `rel="noopener noreferrer"`

### EmailJS Integration

- **Secure API Keys**: EmailJS public keys are safely exposed (as intended by EmailJS)
- **Input Sanitization**: All form data is validated before sending
- **Rate Limiting**: EmailJS provides built-in rate limiting protection

### Dependencies & Build Security

- **Dependency Scanning**: Regular security audits using npm audit
- **Vite Security**: Modern build tool with security best practices
- **HTTPS Enforcement**: All deployments use HTTPS certificates

## 📞 Contact

For security-related questions or concerns:

- Email: [osamahamad261981@gmail.com](mailto:osamahamad261981@gmail.com)
- GitHub Security Advisories: [Enable here](https://github.com/Osama2214/osama-portfolio/security/advisories)

Thank you for helping keep our project secure! 🛡️
