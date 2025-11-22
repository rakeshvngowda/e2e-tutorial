pipeline {
    agent any

    environment {
        IMAGE = "e2e-tutorial"
        REGISTRY = "localhost:5000"
        NAMESPACE = "dev"
    }

    stages {

        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:24-alpine'
                    args '-u root:root'
                    reuseNode true
                }
            }
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE}:latest .
                    docker tag ${IMAGE}:latest ${REGISTRY}/${IMAGE}:latest
                """
            }
        }
        
        stage('Push Image to Local Registry') {
            steps {
                sh "docker push ${REGISTRY}/${IMAGE}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    kubectl apply -f k8s/deployment.yaml -n ${NAMESPACE} --insecure-skip-tls-verify --validate=false
                    kubectl apply -f k8s/service.yaml -n ${NAMESPACE} --insecure-skip-tls-verify --validate=false
                """
            }
        }
    }
    
    post {
        success {
            echo "🚀 Deployment completed successfully!"
        }
        failure {
            echo "❌ Build or Deployment Failed!"
        }
    }
}