# ProjectQuanTriMang
# FastAPI Static Website

A simple static website built with FastAPI, designed for practicing CI/CD pipelines with Jenkins and Docker.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs with Python
- **Static File Serving**: Serves HTML, CSS, and JavaScript files
- **Jinja2 Templating**: Dynamic HTML template rendering
- **Bootstrap Design**: Responsive and modern UI components
- **Docker Ready**: Containerized application with health checks
- **CI/CD Ready**: Includes Jenkinsfile and Docker configurations

## Project Structure

```
fastapi-static-website/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker container configuration
├── docker-compose.yml     # Docker Compose for local development
├── Jenkinsfile            # Jenkins CI/CD pipeline configuration
├── .dockerignore          # Docker build context exclusions
├── .gitignore            # Git version control exclusions
├── README.md             # Project documentation
├── templates/            # Jinja2 HTML templates
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Home page template
│   ├── about.html        # About page template
│   └── contact.html      # Contact page template
└── static/               # Static assets
    ├── css/
    │   └── style.css     # Custom CSS styles
    ├── js/
    │   └── main.js       # JavaScript functionality
    └── images/           # Image assets (empty)
```

## Quick Start

### Local Development

1. **Clone the repository** (or extract the zip file)
   ```bash
   cd fastapi-static-website
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python main.py
   ```

4. **Access the website**
   - Open your browser and navigate to `http://localhost:8000`
   - Available endpoints:
     - `/` - Home page
     - `/about` - About page
     - `/contact` - Contact page
     - `/health` - Health check endpoint

### Docker Development

1. **Build the Docker image**
   ```bash
   docker build -t fastapi-static-website .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 fastapi-static-website
   ```

3. **Using Docker Compose**
   ```bash
   docker-compose up
   ```

## CI/CD Pipeline Setup

### Jenkins Setup

1. **Prerequisites**
   - Jenkins server with Docker support
   - Docker installed on Jenkins agents
   - Git plugin installed in Jenkins

2. **Create a new Pipeline job**
   - Choose "Pipeline" project type
   - Configure SCM to point to your Git repository
   - Set the pipeline script path to `Jenkinsfile`

3. **Configure Jenkins Credentials**
   - Add Docker registry credentials (if using private registry)
   - Configure any deployment credentials

4. **Pipeline Stages**
   - **Checkout**: Pulls the latest code from Git
   - **Install Dependencies**: Sets up Python virtual environment
   - **Run Tests**: Executes test suite (customize as needed)
   - **Build Docker Image**: Creates Docker container
   - **Test Docker Image**: Validates the container works correctly
   - **Push to Registry**: Pushes image to Docker registry (main branch only)
   - **Deploy**: Deploys to target environment (main branch only)

### Customizing the Pipeline

Edit the `Jenkinsfile` to match your environment:

1. **Update Docker Registry**
   ```groovy
   environment {
       DOCKER_REGISTRY = 'your-registry.com'
   }
   ```

2. **Add Tests**
   ```groovy
   stage('Run Tests') {
       steps {
           sh 'python -m pytest tests/'
       }
   }
   ```

3. **Configure Deployment**
   ```groovy
   stage('Deploy') {
       steps {
           sh 'kubectl apply -f k8s/'
       }
   }
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | Home page |
| GET    | `/about` | About page |
| GET    | `/contact` | Contact page |
| GET    | `/health` | Health check endpoint |

## Health Check

The application includes a health check endpoint at `/health` that returns:

```json
{
    "status": "healthy",
    "message": "FastAPI Static Website is running"
}
```

This endpoint is used by:
- Docker health checks
- Load balancers
- Monitoring systems
- CI/CD pipeline validation

## Technology Stack

### Backend
- Python 3.11+
- FastAPI 0.104.1
- Uvicorn ASGI server
- Jinja2 templating engine

### Frontend
- HTML5
- CSS3 with custom styles
- Bootstrap 5 for responsive design
- Vanilla JavaScript

### DevOps
- Docker for containerization
- Jenkins for CI/CD
- Docker Compose for local development

## Development Guidelines

### Adding New Pages

1. Create a new HTML template in `templates/`
2. Add a route in `main.py`
3. Update navigation in `base.html`
4. Test locally before committing

### Styling Guidelines

- Use Bootstrap classes for layout and components
- Add custom styles to `static/css/style.css`
- Maintain responsive design principles
- Test on both desktop and mobile

### JavaScript Guidelines

- Add functionality to `static/js/main.js`
- Use vanilla JavaScript (no frameworks)
- Maintain compatibility with modern browsers
- Include error handling for API calls

## Deployment Options

### Docker Deployment
```bash
docker run -d -p 80:8000 --name fastapi-website fastapi-static-website
```

### Kubernetes Deployment
Create Kubernetes manifests in a `k8s/` directory:
- Deployment
- Service
- Ingress (optional)

### Cloud Deployment
- **AWS**: Use ECS, EKS, or Elastic Beanstalk
- **Google Cloud**: Use Cloud Run, GKE, or App Engine
- **Azure**: Use Container Instances, AKS, or App Service

## Monitoring and Logging

### Health Monitoring
- Use the `/health` endpoint for health checks
- Set up monitoring alerts based on health status
- Configure load balancer health checks

### Application Logging
- Logs are output to stdout/stderr
- Use structured logging in production
- Configure log aggregation (ELK stack, Splunk, etc.)

## Security Considerations

### Production Deployment
- Use HTTPS in production
- Configure proper CORS settings
- Implement rate limiting
- Use secrets management for sensitive data
- Regular security updates

### Docker Security
- Use non-root user in container
- Scan images for vulnerabilities
- Use minimal base images
- Keep dependencies updated

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill the process
   kill -9 <PID>
   ```

2. **Docker Build Fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   ```

3. **Dependencies Not Installing**
   ```bash
   # Upgrade pip
   pip install --upgrade pip
   # Install with verbose output
   pip install -r requirements.txt -v
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes and CI/CD practice.

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review the Jenkins pipeline logs
3. Verify Docker container logs
4. Test the health endpoint

---

**Happy Learning!** 🚀

This project is designed to help you practice DevOps and CI/CD concepts. Feel free to modify and extend it based on your learning objectives.

