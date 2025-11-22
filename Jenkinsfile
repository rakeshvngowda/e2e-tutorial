pipeline {
    agent {
        docker {
            image 'node:24-alpine'
        }
    }

    environment {
        IMAGE = "e2e-tutorial"
        REGISTRY = "localhost:5000"
        NAMESPACE = "dev"
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
        
        stage('Build Project') {
            steps {
                sh 'npm run build || echo "No build script"'
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