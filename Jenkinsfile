pipeline {
    agent any
    
    environment {
        APP_NAME = "e2e-tutorial"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Checkout out branch ${env.BRANCH_NAME}"
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

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Package Artifact') {
            when {
                branch 'main'
            }
            steps {
                sh 'tar -czf build-${BRANCH_NAME}.tar.gz ./'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo "Deploying ${env.APP_NAME} from branch ${env.BRANCH_NAME}"
            }
        }
    }
    
    post {
        always {
            echo "Build completed for branch ${env.BRANCH_NAME}"
        }
        success {
            echo "Build succeeded for branch ${env.BRANCH_NAME}"
        }
        failure {
            echo "Build failed for branch ${env.BRANCH_NAME}"
        }
    }
}