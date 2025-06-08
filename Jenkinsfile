pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'fastapi-static-website'
        DOCKER_TAG = "latest"
        DOCKER_REGISTRY = 'localhost:5000' 
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
                        echo "Running tests..."
                        python -c "import requests; print('Dependencies installed successfully')"
                    '''
                }
            }
        }
        
        stage('Clean Old Images') {
            steps {
                script {
                    bat """
                        echo "Cleaning up old Docker images..."
                        
                        REM Stop and remove any existing containers with the same name
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop running-app || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm running-app || exit /b 0
                        
                        REM Remove dangling images (untagged images)
                        for /f "tokens=*" %%i in ('"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" images -f "dangling=true" -q') do (
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rmi %%i || exit /b 0
                        )
                        
                        REM Remove old versions of our specific image (keep only latest)
                        for /f "skip=1 tokens=*" %%i in ('"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" images ${DOCKER_REGISTRY}/${DOCKER_IMAGE} --format "{{.ID}}"') do (
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rmi %%i || exit /b 0
                        )
                    """
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    bat """
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Test Docker Image') {
            steps {
                script {
                    bat """
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" run -d --name test-container -p 8001:8000 localhost:5000/my-fastapi-app:latest
                        
                        powershell -Command "Start-Sleep -Seconds 10"

                        curl -f http://localhost:8001/health || (
                            echo Health check failed!
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container
                            exit /b 1
                        )
                        
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container
                    """
                }
            }
        }

        stage('Push to Registry') {
            // when {
            //     branch 'Hieu_branch'
            // }
            steps {
                script {
                    bat """
                        REM Login to your private registry (if needed, configure credentials in Jenkins or skip if no auth)
                        REM echo your_password | docker login localhost:5000 --username your_username --password-stdin
                        
                        REM Tag the images with the registry prefix
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                        REM Push the tagged images to your private registry
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    bat '''
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" run -d --name running-app -p 9999:8000 localhost:5000/fastapi-static-website:latest
                    '''
                }
            }
        }

        stage('Post-Deploy Cleanup') {
            steps {
                script {
                    bat """
                        echo "Performing post-deploy cleanup..."
                        
                        REM Remove unused images (not associated with any container)
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" image prune -f
                        
                        REM Remove unused volumes
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" volume prune -f
                        
                        REM Remove unused networks
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" network prune -f
                        
                        REM Optional: More aggressive cleanup - remove all unused containers, networks, images
                        REM "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" system prune -f
                        
                        echo "Cleanup completed"
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                bat '''
                    echo "Final cleanup in post section..."
                    
                    REM Clean up test containers
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container || exit /b 0
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container || exit /b 0
                    
                    REM Remove build cache and temporary images
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" builder prune -f || exit /b 0
                '''
            }
            echo "Pipeline completed - result: ${currentBuild.currentResult}"
        }
        
        failure {
            script {
                bat '''
                    echo "Pipeline failed - performing emergency cleanup..."
                    
                    REM Stop and remove any hanging containers
                    for /f "tokens=*" %%i in ('"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" ps -aq') do (
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop %%i || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm %%i || exit /b 0
                    )
                    
                    REM Clean up dangling images
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" image prune -f || exit /b 0
                '''
            }
        }
    }
}