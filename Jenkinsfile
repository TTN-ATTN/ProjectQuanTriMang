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
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" tag ${DOCKER_IMAGE}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                            
                            REM Push the tagged images to your private registry
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }



        
        stage('Deploy') {
            // when {
            //     branch 'Hieu_branch'
            // }
            steps {
                script {
                    bat '''
                        REM Stop and remove any existing container
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop running-app || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm running-app || exit /b 0

                        REM Run the actual production container
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" run -d --name running-app -p 9999:8000 localhost:5000/fastapi-static-website:latest
                    '''
                }
            }
        }

        // filepath: d:\ATTN2023\Network administration\ProjectQuanTriMang\Jenkinsfile
        stage('Show Container Logs') {
            steps {
                script {
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" logs running-app || exit /b 0'
                }
            }
        }

    }
    
        post {
            always {
                script {
                    bat '''
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" stop test-container || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm test-container || exit /b 0
                        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rmi %DOCKER_IMAGE%:%DOCKER_TAG% || exit /b 0
                    '''
                }
                echo "Pipeline completed - result: ${currentBuild.currentResult}"
            }
        }

}

