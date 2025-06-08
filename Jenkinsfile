pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'fastapi-static-website'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'your-registry.com' // Replace with your Docker registry
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        sudo apt-get update
                        sudo apt-get install -y python3-venv
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    sh '''
                        . venv/bin/activate
                        # Add your test commands here
                        # Example: python -m pytest tests/
                        echo "Running tests..."
                        python -c "import requests; print('Dependencies installed successfully')"
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                script {
                    sh '''
                        # Run container in background
                        docker run -d --name test-container -p 8001:8000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        
                        # Wait for container to start
                        sleep 10
                        
                        # Test health endpoint
                        curl -f http://localhost:8001/health || exit 1
                        
                        # Cleanup
                        docker stop test-container
                        docker rm test-container
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        # Login to Docker registry (configure credentials in Jenkins)
                        # docker login ${DOCKER_REGISTRY}
                        
                        # Tag and push images
                        # docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        # docker tag ${DOCKER_IMAGE}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        # docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        # docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        
                        echo "Skipping push to registry (configure your registry settings)"
                    '''
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        # Deploy to your environment
                        # Example: kubectl apply -f k8s/
                        # Example: docker-compose up -d
                        echo "Deployment step - configure based on your infrastructure"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Clean up
            sh '''
                docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                docker rmi ${DOCKER_IMAGE}:latest || true
            '''
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

