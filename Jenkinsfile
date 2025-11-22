pipeline {
    agent any

    environment {
        IMAGE = "e2e-tutorial"
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
                """
            }
        }
        
        stage('Load Image to Minikube') {
            steps {
                sh """
                    minikube image load ${IMAGE}:latest
                """
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')]) {
                    sh """
                        export KUBECONFIG=\$KUBECONFIG_PATH
                        kubectl apply -f k8s/deployment.yaml -n ${NAMESPACE} --validate=false
                        kubectl rollout restart deployment/e2e-tutorial -n ${NAMESPACE}
                    """
                }
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