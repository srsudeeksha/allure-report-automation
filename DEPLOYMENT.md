# Deployment Guide

## Production URL

**Application Domain**: `interns.voltusfreight.com`

## Server Information

- **Server Address**: `172.16.10.15`
- **Username**: `vw-srv-0003`
- **Password**: `Apple#123`
- **Project Directory**: `~/projects/allure-report-automation`

## Prerequisites

- Docker version 24.0.2
- Docker Compose version 1.23.1
- Git access to the repository

## Deployment Process

### 1. Connect to the Server

```bash
ssh vw-srv-0003@172.16.10.15
# Password: Apple#123
```

### 2. Navigate to Project Directory

```bash
cd ~/projects/allure-report-automation
```

### 3. Pull Latest Changes

```bash
git pull origin main
```

### 4. Stop Running Containers (if any)

```bash
docker-compose down
```

### 5. Build the New Image

**Important**: You must build the backend image manually before starting the services.

```bash
docker-compose build backend
```

This step is crucial because:
- It rebuilds the Node.js backend with any code changes
- Uses Node.js 18.17.1-alpine (compatible with Docker 24.0.2)
- Ensures the latest application code is included

### 6. Start the Services

```bash
docker-compose up -d
```

The `-d` flag runs the containers in detached mode (background).

### 7. Verify Deployment

Check that both containers are running:

```bash
docker-compose ps
```

Expected output:
```
NAME           IMAGE                              COMMAND                  SERVICE   CREATED          STATUS                    PORTS
mysql-db       mysql:8.0.32                       "docker-entrypoint.s…"   db        XX seconds ago   Up XX seconds (healthy)   0.0.0.0:3307->3306/tcp
node-backend   allure-report-automation-backend   "docker-entrypoint.s…"   backend   XX seconds ago   Up XX seconds             0.0.0.0:8000->5000/tcp
```

### 8. Check Application Health

Test the health endpoint from the server:

```bash
curl http://localhost:8000/health
```

Or test from external network:

```bash
curl http://interns.voltusfreight.com/health
```

Expected response:
```json
{
    "status": "ok",
    "db": "up",
    "message": "Server is healthy"
}
```

### 9. View Logs (if needed)

To check application logs:

```bash
# View all logs
docker-compose logs

# View backend logs only
docker-compose logs backend

# View database logs only
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f backend
```

## Application Access

Once deployed, the application is accessible at:

### Production URLs (External Access)

- **Backend API**: `http://interns.voltusfreight.com`
- **Health Check**: `http://interns.voltusfreight.com/health`

### Internal Server URLs (For Server Access)

- **Backend API**: `http://172.16.10.15:8000` or `http://localhost:8000`
- **Health Check**: `http://172.16.10.15:8000/health`
- **MySQL Database**: `172.16.10.15:3307` (internal access only)

### API Endpoints

All endpoints are accessible via the production domain `interns.voltusfreight.com`:

- `GET /health` - Health check with database connectivity test
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users` - Get all users (requires JWT authentication)
- `GET /api/users/me` - Get current user profile (requires JWT authentication)

**Example**:
```bash
# External access
curl http://interns.voltusfreight.com/health

# From server
curl http://localhost:8000/health
```

## Configuration

### Database Configuration

- **Host**: `db` (internal Docker network) / `172.16.10.15:3307` (external)
- **Database Name**: `weatherapp`
- **Root User**: `root`
- **Root Password**: `Apple#123`

### Backend Configuration

- **Port**: `8000`
- **Node Environment**: `production`
- **JWT Secret**: `supersecretjwt`

## Troubleshooting

### Container Won't Start

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs backend
docker-compose logs db
```

### Database Connection Issues

```bash
# Check if MySQL is healthy
docker-compose ps

# Test MySQL connection
docker exec -it mysql-db mysql -uroot -pApple#123 -e "SELECT 1"
```

### Port Conflicts

If port 8000 or 3307 is already in use:

```bash
# Check what's using the port
lsof -i :8000
lsof -i :3307

# Stop the conflicting service or update docker-compose.yml
```

### Rebuild from Scratch

If you need to completely rebuild:

```bash
# Stop and remove everything
docker-compose down -v

# Remove old images
docker-compose down --rmi all

# Rebuild and start fresh
docker-compose build --no-cache
docker-compose up -d
```

## Rollback Procedure

If deployment fails:

```bash
# Stop current deployment
docker-compose down

# Checkout previous stable version
git checkout <previous-commit-hash>

# Rebuild and deploy
docker-compose build backend
docker-compose up -d
```

## Maintenance

### Update Application

```bash
cd ~/projects/allure-report-automation
git pull origin main
docker-compose down
docker-compose build backend
docker-compose up -d
```

### Backup Database

```bash
# Create backup
docker exec mysql-db mysqldump -uroot -pApple#123 weatherapp > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker exec -i mysql-db mysql -uroot -pApple#123 weatherapp < backup_file.sql
```

### View Resource Usage

```bash
# Check CPU and memory usage
docker stats

# Check disk usage
docker system df
```

## Important Notes

- **Production Domain**: The application is publicly accessible at `interns.voltusfreight.com`
- **DNS/Reverse Proxy**: The domain is configured to point to the server and route traffic to port 8000
- **Docker Compatibility**: This setup is specifically configured for Docker 24.0.2 and Docker Compose 1.23.1
- **MySQL Version**: Uses MySQL 8.0.32 (not latest) for manifest compatibility
- **Node.js Version**: Uses Node.js 18.17.1-alpine (not latest) for manifest compatibility
- **Always build manually**: The backend image must be built with `docker-compose build backend` before deploying
- **Swarm Mode Warning**: The server runs in swarm mode, but this deployment uses regular docker-compose (not stack deploy)

## Support

For issues or questions, contact the development team or check the application logs for detailed error messages.
