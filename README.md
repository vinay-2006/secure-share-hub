# Secure Share Hub

[![Frontend CI](https://github.com/vinay-2006/secure-share-hub/workflows/Frontend%20CI/badge.svg)](https://github.com/vinay-2006/secure-share-hub/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/vinay-2006/secure-share-hub/workflows/Backend%20CI/badge.svg)](https://github.com/vinay-2006/secure-share-hub/actions/workflows/backend-ci.yml)
[![CodeQL](https://github.com/vinay-2006/secure-share-hub/workflows/CodeQL/badge.svg)](https://github.com/vinay-2006/secure-share-hub/actions/workflows/codeql.yml)
[![Deploy](https://github.com/vinay-2006/secure-share-hub/workflows/Deploy/badge.svg)](https://github.com/vinay-2006/secure-share-hub/actions/workflows/deploy.yml)

A production-ready, full-stack secure file sharing application with end-to-end encryption, access control, and activity tracking.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control and refresh tokens
- 📁 **File Sharing** - Upload and share files with unique access tokens and comprehensive validation
- ⏰ **Expiration Control** - Set automatic expiration times for shared files
- 📊 **Download Limits** - Control the number of times a file can be downloaded
- 🔒 **Access Revocation** - Revoke access to shared files at any time
- 📈 **Activity Tracking** - Monitor all file access and download activities
- 👥 **Admin Dashboard** - Comprehensive admin panel for managing users and files
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- 🛡️ **Security First** - Rate limiting, input validation, secure file upload, and comprehensive security headers
- 📝 **File Validation** - Client and server-side file type, size, and content validation
- 🖼️ **Image Preview** - Preview images before uploading
- ⚡ **CI/CD Pipeline** - Automated testing, linting, and deployment

## Technologies Used

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Vitest** - Testing framework
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Winston** - Structured logging
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation
- **Jest** - Testing framework

## Project Structure

```
secure-share-hub/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── lib/                # Contexts and utilities
│   ├── services/           # API service layer
│   └── App.tsx             # Main app component
├── server/                  # Backend source code
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # MongoDB models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── uploads/            # File storage directory
│   └── package.json
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Running locally or MongoDB Atlas
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd secure-share-hub
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Set up environment variables**

Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-share-hub
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:5173
```

5. **Seed the database with initial admin user**
```bash
cd server
npm run seed
cd ..
```

This creates an admin user:
- Email: `admin@example.com`
- Password: `Admin123!`

### Running the Application

**Option 1: Run both client and server together**
```bash
npm run dev:full
```

**Option 2: Run separately**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Default Credentials

After seeding the database:
- **Admin**: admin@example.com / Admin123!

You can register new users through the application.

## API Documentation

For detailed API documentation, see [server/README.md](./server/README.md)

### Main Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get user's files
- `GET /api/files/download/:token` - Download file by token
- `GET /api/admin/stats` - Get admin statistics (admin only)

## Development

### Available Scripts

**Root directory:**
- `npm run dev` - Start frontend dev server
- `npm run dev:server` - Start backend dev server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend
- `npm run build:server` - Build backend
- `npm run build:full` - Build both
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:coverage` - Generate coverage report

**Server directory:**
- `npm run dev` - Start backend in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with admin user
- `npm run test` - Run backend tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint on backend code

## Testing

### Frontend Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Backend Tests
```bash
cd server

# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure
- `src/test/` - Frontend tests
- `server/src/__tests__/` - Backend tests

## Security Features

- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **Rate Limiting** - Protect against brute force attacks
  - Auth endpoints: 5 attempts per 15 minutes
  - Upload endpoints: 20 uploads per hour
  - General API: 100 requests per 15 minutes
- ✅ **Input Validation** - Comprehensive validation using express-validator
- ✅ **File Validation** - Client and server-side file type, size, and content checks
- ✅ **Security Headers** - Helmet middleware for HTTP security headers
- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **CORS Protection** - Configured cross-origin resource sharing
- ✅ **XSS Prevention** - Input sanitization and validation
- ✅ **SQL Injection Prevention** - Mongoose ODM with parameterized queries

## CI/CD Pipeline

The project includes comprehensive GitHub Actions workflows:

### Frontend CI
- Linting with ESLint
- Type checking with TypeScript
- Unit and integration tests
- Build verification
- Bundle size analysis
- Runs on: Push to main, Pull requests

### Backend CI
- Linting with ESLint
- Type checking with TypeScript
- Unit and integration tests
- Build verification
- Security audit with npm audit
- Runs on: Push to main, Pull requests

### CodeQL Security Scanning
- Automated code analysis
- Security vulnerability detection
- Runs on: Push, Pull requests, Weekly schedule

### Deployment
- Automated deployment to Vercel (frontend)
- Backend deployment (configure Railway/Render/Heroku)
- Runs on: Push to main branch

### Dependabot
- Automated dependency updates
- Weekly checks for frontend and backend
- Automated security patches

## File Upload Limits

- **Maximum file size**: 50MB
- **Supported file types**:
  - Images: JPG, PNG, GIF, WebP, SVG
  - Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, MD
  - Archives: ZIP, RAR, 7Z, TAR, GZ
  - Code: JSON, XML, HTML, CSS, JS
  - Audio: MP3, WAV, OGG
  - Video: MP4, WebM, OGV
- **Security**: Dangerous file types (.exe, .bat, etc.) are blocked

## Monitoring & Logging

- **Winston Logger** - Structured logging with multiple transports
  - Console logging (development)
  - File logging (error.log, combined.log)
  - Configurable log levels
- **Activity Tracking** - All file access and downloads are logged
- **Error Tracking** - Comprehensive error handling and logging

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and import your repository
3. Set environment variables:
   - `VITE_API_URL` - Your backend API URL

### Backend

The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS
- Any Node.js hosting platform

Make sure to:
1. Set all required environment variables
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Change JWT secrets to secure random strings
4. Set `NODE_ENV=production`

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Secure HTTP headers with Helmet
- CORS configuration
- Input validation
- File type whitelisting
- File size limits
- Access token generation with crypto
- Activity logging with IP tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [server README](./server/README.md) for backend-specific documentation
- Review the API documentation

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
