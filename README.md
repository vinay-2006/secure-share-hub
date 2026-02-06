# 🔐 Secure Share Hub

A production-ready, full-stack secure file sharing application with JWT authentication, rate limiting, comprehensive testing, and CI/CD pipelines.

## ✨ Features

### 🔒 Security (Production-Grade)
- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Rate Limiting**: Advanced protection against abuse
  - Auth endpoints: 5 attempts per 15 minutes
  - File uploads: 20 per hour  
  - Admin operations: 50 requests per 15 minutes
  - General API: 100 requests per 15 minutes
- **Password Hashing**: bcrypt with 10 salt rounds
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for XSS, clickjacking, and MIME-sniffing protection
- **CORS Configuration**: Controlled cross-origin access with credentials support

### 📁 File Management
- **Secure File Upload**: 50MB file size limit with multi-layer validation
- **Supported File Types**: 
  - Images: JPEG, PNG, GIF, WebP, SVG
  - Documents: PDF, Word, Excel, PowerPoint, Text, CSV
  - Archives: ZIP, RAR, 7z, TAR, GZIP
- **Frontend Validation**: Real-time validation for size, type, extension, and filename
- **Backend Validation**: Multer middleware with MIME type whitelisting
- **Access Control**: Token-based file access with expiry and download limits
- **File Settings**: Configure visibility (public/private), expiry dates, max downloads
- **Activity Tracking**: Monitor all file access and download events

### 👥 User Roles & Admin Features
- **User Role**: Upload, manage, and share personal files
- **Admin Role**: Full system access with comprehensive management
  - User management and role assignment
  - System-wide file management
  - Analytics dashboard with statistics
  - Activity monitoring across all users

### 📊 Analytics & Monitoring
- **Dashboard Statistics**: Total files, downloads, active shares, storage usage
- **Activity Tracking**: Complete audit trail of file operations
- **Risk Assessment**: Identify high-risk files based on access patterns
- **Real-time Updates**: Live activity feed

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Dark Mode**: System-aware theme with manual toggle
- **Loading States**: Skeleton loaders for files, stats, and dashboards
- **Error Handling**: Comprehensive error states with retry functionality
- **Empty States**: Helpful messaging and calls-to-action
- **Toast Notifications**: Real-time feedback using Sonner
- **Drag & Drop**: Intuitive file upload (ready for integration)

### 🧪 Comprehensive Testing
- **Frontend**: 21+ tests with Vitest and React Testing Library
- **MSW Integration**: Mock Service Worker for reliable API testing
- **Backend**: Jest + Supertest for API endpoint testing
- **Test Coverage**: Infrastructure for 80%+ coverage
- **CI Integration**: Automated testing on all PRs

### 🚀 CI/CD & DevOps
- **GitHub Actions Workflows**:
  - Frontend CI: Lint, type check, test, build, bundle analysis
  - Backend CI: Type check, test, build, security audit
- **Dependabot**: Automated weekly dependency updates
- **Vercel Deployment**: Automatic frontend deployments
- **Security Audits**: npm audit on every build

## 🏗️ Architecture

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations

### Backend
- **Node.js** with **TypeScript** - Runtime and type safety
- **Express.js** - Web framework with middleware architecture
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** (jsonwebtoken) - Token-based authentication
- **bcryptjs** - Password hashing (10 rounds)
- **Multer v2** - Secure file upload handling
- **Helmet** - Security headers middleware
- **express-rate-limit** - Rate limiting protection
- **express-validator** - Input validation and sanitization
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Jest** + **Supertest** - Backend testing
- **MongoDB Memory Server** - In-memory MongoDB for tests

### DevOps & Testing
- **Vitest** - Fast unit testing for frontend
- **React Testing Library** - Component testing
- **MSW** (Mock Service Worker) - API mocking
- **GitHub Actions** - CI/CD pipelines
- **Dependabot** - Automated dependency updates
- **ESLint** + **TypeScript ESLint** - Code linting
- **Vercel** - Frontend hosting and deployment

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 6.x (local or Atlas)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vinay-2006/secure-share-hub.git
cd secure-share-hub
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create `.env` files in both root and server directories:

**Root `.env`** (Frontend):
```env
VITE_API_URL=http://localhost:5000/api
```

**Server `.env`** (Backend):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-share-hub
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the Database (Optional)

```bash
cd server
npm run seed
cd ..
```

This creates:
- Admin user: `admin@example.com` / `Admin123!`
- Test files and activity data

### 5. Run the Application

**Option A: Run both frontend and backend together**
```bash
npm run dev:full
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🧪 Running Tests

### Frontend Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

### Backend Tests
```bash
cd server

# Run all tests
npm test

# Watch mode
npm run test:watch

# CI mode with coverage
npm run test:ci
```

## 🏗️ Building for Production

### Frontend
```bash
# Development build
npm run build:dev

# Production build
npm run build
```

### Backend
```bash
cd server
npm run build
```

## 📁 Project Structure

```
secure-share-hub/
├── .github/
│   ├── workflows/
│   │   ├── frontend-ci.yml      # Frontend CI pipeline
│   │   └── backend-ci.yml       # Backend CI pipeline
│   └── dependabot.yml           # Dependency updates config
├── src/                         # Frontend source code
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── FileUpload.tsx       # File upload component
│   │   ├── FileCard.tsx         # File display card
│   │   ├── ErrorState.tsx       # Error state component
│   │   ├── EmptyState.tsx       # Empty state component
│   │   └── LoadingSkeletons.tsx # Loading skeletons
│   ├── pages/                   # Page components
│   ├── lib/
│   │   ├── auth-context.tsx     # Auth state management
│   │   ├── file-context.tsx     # File state management
│   │   └── fileValidation.ts    # File validation utilities
│   ├── services/
│   │   └── api.ts               # API client with interceptors
│   ├── test/
│   │   ├── mocks/               # MSW handlers
│   │   ├── setup.ts             # Test configuration
│   │   └── *.test.tsx           # Test files
│   └── App.tsx                  # Main app component
├── server/                      # Backend source code
│   ├── src/
│   │   ├── __tests__/           # Backend tests
│   │   ├── config/              # Configuration
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT authentication
│   │   │   ├── rateLimiter.ts   # Rate limiting
│   │   │   ├── upload.ts        # File upload handling
│   │   │   └── errorHandler.ts  # Error handling
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── utils/               # Utilities & validators
│   │   └── index.ts             # Server entry point
│   ├── uploads/                 # File storage
│   ├── jest.config.js           # Jest configuration
│   └── package.json
├── vercel.json                  # Vercel deployment config
├── vitest.config.ts             # Vitest configuration
└── package.json
```

## 🔒 Security Features

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT-based stateless authentication
   - Separate access (24h) and refresh (7d) tokens
   - Secure HTTP-only cookie support ready
   - Role-based access control (user/admin)
   - Password hashing with bcrypt (10 rounds)

2. **Rate Limiting**
   - Per-endpoint rate limiting to prevent abuse
   - Customized limits for different operations
   - IP-based tracking
   - Standard headers for rate limit info

3. **Input Validation**
   - Frontend validation for immediate feedback
   - Backend validation with express-validator
   - File type, size, and name validation
   - MIME type verification
   - Extension whitelist

4. **HTTP Security Headers** (via Helmet)
   - Content Security Policy
   - X-Frame-Options (clickjacking protection)
   - X-Content-Type-Options (MIME-sniffing protection)
   - X-XSS-Protection
   - Strict-Transport-Security ready

5. **CORS Protection**
   - Configurable origin whitelist
   - Credentials support for cookies
   - Preflight request handling

6. **Error Handling**
   - Secure error messages (no stack traces in production)
   - Consistent error response format
   - Logging for debugging without exposing internals

## 🚀 Deployment

### Frontend (Vercel)

The frontend is configured for automatic deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
4. Deploy!

### Backend (Railway/Render/Heroku)

1. Choose your platform (Railway recommended)
2. Connect your GitHub repository
3. Set environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   JWT_REFRESH_SECRET=your-production-refresh-secret
   CORS_ORIGIN=https://your-frontend-url.com
   NODE_ENV=production
   ```
4. Set build command: `cd server && npm install && npm run build`
5. Set start command: `cd server && npm start`

## 📊 API Documentation

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

**Server directory:**
- `npm run dev` - Start backend in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with admin user

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
