pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'fastapi-static-website'
        DOCKER_TAG = "lastest"
        DOCKER_REGISTRY = 'localhost:5000' // Replace with your Docker registry
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
                   bat '''
                    cd %WORKSPACE%
                    "C:\\Users\\Dell\\AppData\\Local\\Programs\\Python\\Python312\\python.exe" -m venv venv
                    venv\\Scripts\\python.exe -m pip install --upgrade pip
                    venv\\Scripts\\python.exe -m pip install -r requirements.txt
                '''


                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    bat '''
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
                    bat '''
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" build -t localhost:5000/my-fastapi-app:latest .
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" tag localhost:5000/my-fastapi-app:latest localhost:5000/my-fastapi-app:latest
                    '''
                }
            }
        }

        
        stage('Test Docker Image') {
            steps {
                script {
                    bat '''
                       
                        docker run -d --name test-container -p 8001:8000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        
                     
                        sleep 10
                        
                      
                        curl -f http://localhost:8001/health || exit 1
                        
                   
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
                    bat '''
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
                    bat '''
                  
                        echo "Deployment step - configure based on your infrastructure"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Clean up
            bat '''
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

