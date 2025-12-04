# AnyComp Backend

Backend API for the AnyComp platform - A specialist comparison and management system.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via TypeORM)
- **Authentication**: JWT
- **File Upload**: Multer

## Local Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5002
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=anycomp_db
   
   JWT_SECRET=your_secure_jwt_secret
   ```

3. **Run migrations**:
   ```bash
   npm run migration:run
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5002/api`

## Production Build

### Build the application:
```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript in the `dist` folder
2. Run database migrations automatically

### Start production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Specialists
- `GET /api/specialists` - Get all specialists (public)
- `GET /api/specialists/:id` - Get specialist by ID (public)
- `POST /api/specialists` - Create specialist (requires auth)
- `PUT /api/specialists/:id` - Update specialist (requires auth)
- `DELETE /api/specialists/:id` - Delete specialist (requires auth)

### Public
- `GET /api/public/specialists` - Get all specialists with filters
- `GET /api/public/specialists/:id` - Get specialist details

## Database Migrations

### Create a new migration:
```bash
npm run migration:create --name=YourMigrationName
```

### Run migrations:
```bash
npm run migration:run
```

### Revert last migration:
```bash
npm run migration:revert
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── db/              # Database config and migrations
│   ├── middlewares/     # Express middlewares
│   ├── models/          # TypeORM entities
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   └── app.ts           # Application entry point
├── public/
│   └── uploads/         # Uploaded files (images)
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory for detailed deployment instructions.

### Quick Deploy to Render

1. Push your code to GitHub
2. Connect your repository to Render
3. Set root directory to `backend`
4. Configure environment variables
5. Deploy!

Build Command: `npm install && npm run build`
Start Command: `npm start`

## Environment Variables for Production

```env
PORT=10000
NODE_ENV=production

DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database

JWT_SECRET=your-secure-jwt-secret
```

## Default Admin User

On first startup, an admin user is automatically created:

- **Email**: `admin@stcomp.com`
- **Password**: `AdminPassword123`

⚠️ **Important**: Change this password immediately in production!

## File Uploads

Images are stored in `public/uploads/` directory. 

⚠️ **Note for Render Free Tier**: Uploaded files will be deleted when the server restarts. For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

## Security Features

- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Password hashing with bcrypt
- SQL injection protection via TypeORM

## License

ISC
