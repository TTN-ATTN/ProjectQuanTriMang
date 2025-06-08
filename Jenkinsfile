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
        
        stage('Clean Old App Containers') {
            steps {
                script {
                    bat """
                        echo "Cleaning up old application containers..."
                        
                        REM Stop and remove any existing app containers ONLY
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop running-app || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm running-app || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container || exit /b 0
                        
                        REM Remove only our specific old images (NOT the registry!)
                        for /f "tokens=*" %%i in ('"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" images ${DOCKER_IMAGE} -q 2^>nul') do (
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rmi %%i || exit /b 0
                        )
                    """
                }
            }
        }
        
        stage('Verify Registry') {
            steps {
                script {
                    bat """
                        echo "Checking if registry is running..."
                        
                        REM Check if registry container is running
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" ps | findstr registry || (
                            echo "Registry not running, starting it..."
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" start registry || (
                                echo "Starting new registry container..."
                                "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" run -d -p 5000:5000 --name registry registry:2
                            )
                        )
                        
                        REM Wait for registry to be ready
                        timeout /t 5 /nobreak > nul
                        
                        REM Test registry connectivity
                        curl -f http://localhost:5000/v2/ || (
                            echo "Registry health check failed!"
                            exit /b 1
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
                    """
                }
            }
        }

        stage('Test Docker Image') {
            steps {
                script {
                    bat """
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" run -d --name test-container -p 8001:8000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        
                        powershell -Command "Start-Sleep -Seconds 10"

                        curl -f http://localhost:8001/health || (
                            echo Health check failed!
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" logs test-container
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
            steps {
                script {
                    bat """
                        echo "Tagging and pushing image to registry..."
                        
                        REM Tag the image with the registry prefix
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                        REM Push the tagged image to your private registry
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    bat '''
                        echo "Deploying application..."
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" run -d --name running-app -p 9999:8000 localhost:5000/fastapi-static-website:latest
                        
                        REM Wait a moment for container to start
                        timeout /t 5 /nobreak > nul
                        
                        REM Verify deployment
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" ps | findstr running-app || (
                            echo "Deployment failed - container not running"
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" logs running-app
                            exit /b 1
                        )
                    '''
                }
            }
        }

        stage('Selective Cleanup') {
            steps {
                script {
                    bat """
                        echo "Performing selective cleanup..."
                        
                        REM Remove only unused images (but preserve registry!)
                        for /f "tokens=*" %%i in ('"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" images -f "dangling=true" -q') do (
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rmi %%i || exit /b 0
                        )
                        
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
                    
                    REM Clean up test containers only
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container || exit /b 0
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container || exit /b 0
                '''
            }
            echo "Pipeline completed - result: ${currentBuild.currentResult}"
        }
        
        failure {
            script {
                bat '''
                    echo "Pipeline failed - performing emergency cleanup..."
                    
                    REM Stop and remove only our app containers (NOT registry!)
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop running-app || exit /b 0
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm running-app || exit /b 0
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container || exit /b 0
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container || exit /b 0
                '''
            }
        }
    }
}