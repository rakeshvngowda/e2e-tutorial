pipeline {
    agent {
        docker {
            image 'node:24-alpine'
            args '-u root:root'
        }
    }

    environment {
        IMAGE = "e2e-tutorial"
        REGISTRY = "localhost:5000"
        NAMESPACE = "dev"
        HOME = "${WORKSPACE}"
    }

    stages {
        stage('Check Node') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t $IMAGE:latest .
                    docker tag $IMAGE:latest $REGISTRY/$IMAGE:latest
                """
            }
        }
        
        stage('Push Image to Local Registry') {
            steps {
                sh "docker push $REGISTRY/$IMAGE:latest"
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sh """
                    kubectl apply -f k8s/deployment.yaml -n $NAMESPACE
                    kubectl apply -f k8s/service.yaml -n $NAMESPACE
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