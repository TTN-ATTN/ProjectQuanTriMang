pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'fastapi-static-website'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_USERNAME = 'trantrungnhan'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'trantrungnhan/fastapi-static-website'
    }

    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                python3 -m venv venv
                . venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                '''
            }
        }
        
        stage('Test dependencies') {
            steps {
                sh '''
                    python3 -c "import requests; print('Dependencies installed successfully')"
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                '''
            }
        }
        
        stage('Test Docker Image') {
            steps {
                sh '''
                    docker run -d --name test-container -p 8001:8000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                    sleep 10
                    curl -f http://localhost:8001/health || exit 1
                    docker stop test-container
                    docker rm test-container
                '''
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-registry-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                            echo "${DOCKER_PASS}" | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USER} --password-stdin
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_REPO}:${DOCKER_TAG}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}:${DOCKER_TAG}
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Deploying container..."
                    docker stop deployed-container || true
                    docker rm deployed-container || true
                    docker pull ${DOCKER_REGISTRY}/${DOCKER_REPO}:${DOCKER_TAG}
                    docker run -d --name deployed-container -p 8000:8000 ${DOCKER_REGISTRY}/${DOCKER_REPO}:${DOCKER_TAG}
                '''
            }
        }
    }
    
    post {
        always {
            script {
                sh 'docker stop test-container || true'
                sh 'docker rm test-container || true'
                sh 'docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true'
            }
            echo "Pipeline completed - result: ${currentBuild.currentResult}"
        }
    }
}
