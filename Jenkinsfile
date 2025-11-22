pipeline {
    agent any

    environment {
        IMAGE_NAME = "e2e-tutorial"
        DOCKER_LOCAL_REGISTRY = "localhost"
    }

    tools {
        nodejs "node-24"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test || true'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BRANCH_NAME} .'
            }
        }

        stage('Push to Local Registry (Minikube)') {
            when {
                branch 'main'
            }
            steps {
                sh "eval \$(minikube docker-env)"
                sh 'docker tag ${IMAGE_NAME}:${BRANCH_NAME} ${IMAGE_NAME}:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
                sh 'kubectl rollout restart deployment e2e-tutorial'
            }
        }

        post {
            success {
                echo 'Pipeline completed successfully for branch: ${BRANCH_NAME}'
            }
            failure {
                echo 'Pipeline failed for branch: ${BRANCH_NAME}'
            }
        }
    }
}