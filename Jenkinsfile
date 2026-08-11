pipeline {
    agent any

    environment {
        // Shared workspace mappings
        ECR_REPO_NAME  = "gym-profile-service"
        KUBERNETES_DIR = "${WORKSPACE}/k8s"
        NAMESPACE      = "gym-dev"
        AWS_REGION     = "us-east-1"
        CLUSTER_NAME   = "gym-cluster"
        SECRET_NAME    = "gym/dev/profile-postgres-credentials"

        // Safe evaluation fallback for Git SHA
        IMAGE_TAG      = "${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'latest'}"

        // Jenkins Credentials Store bindings (Available globally across all stages & post block)
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_ACCOUNT_ID        = credentials('aws-account-id')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('ECR Authentication') {
            steps {
                echo '🔐 Authenticating Docker daemon with AWS ECR...'
                sh "aws ecr get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
            }
        }

        stage('Build Container Image') {
            steps {
                echo "🏭 Building Docker image tagged as: ${env.IMAGE_TAG}..."
                sh "docker build -t ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:${env.IMAGE_TAG} ."
                sh "docker tag ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:latest"
            }
        }

        stage('Push Image to AWS ECR') {
            steps {
                echo "🚀 Pushing image artifact [${env.IMAGE_TAG}] to AWS ECR..."
                sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:${env.IMAGE_TAG}"
                sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:latest"
            }
        }

        stage('Authenticate to EKS') {
            steps {
                echo '🛡️ Updating cluster context connection...'
                sh "aws eks update-kubeconfig --region ${env.AWS_REGION} --name ${env.CLUSTER_NAME}"
            }
        }

        stage('Sync Postgres Credentials to AWS Secrets Manager') {
            steps {
                echo '🔐 Ensuring Postgres credentials exist in AWS Secrets Manager...'
                withCredentials([usernamePassword(credentialsId: 'profile-postgres-credentials', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASSWORD')]) {
                    sh '''
                        if aws secretsmanager describe-secret --secret-id "${SECRET_NAME}" > /dev/null 2>&1; then
                            echo "Secret '${SECRET_NAME}' already exists. Skipping creation."
                        else
                            echo "Secret '${SECRET_NAME}' does not exist. Creating from Jenkins credentials..."
                            cat > /tmp/profile-db-credentials.json <<EOF
                        {"username":"${DB_USER}","password":"${DB_PASSWORD}"}
                        EOF
                            aws secretsmanager create-secret \
                                --name "${SECRET_NAME}" \
                                --secret-string file:///tmp/profile-db-credentials.json
                            rm -f /tmp/profile-db-credentials.json
                        fi
                    '''
                }
            }
        }

        stage('Deploy Postgres') {
            steps {
                echo '🗄️ Provisioning Postgres ExternalSecret & waiting for sync...'
                sh "kubectl apply -f ${env.KUBERNETES_DIR}/secret.yaml"
                sh """
                    for i in \$(seq 1 12); do
                        if kubectl get secret postgres-secret -n ${env.NAMESPACE} >/dev/null 2>&1; then
                            echo "✅ Secret postgres-secret present!"
                            break
                        fi
                        echo "Waiting for postgres-secret creation..."
                        sleep 5
                    done
                """

                echo '🚀 Deploying Postgres StatefulSet & Service...'
                sh "kubectl apply -f ${env.KUBERNETES_DIR}/postgres-statefulset.yaml"
                sh "kubectl apply -f ${env.KUBERNETES_DIR}/postgres-service.yaml"
                sh "kubectl rollout status statefulset/postgres -n ${env.NAMESPACE} --timeout=180s"
            }
        }

        stage('Deploy Profile Service') {
            steps {
                echo '🚀 Deploying Profile Service & Service...'
                script {
                    temp_deployment = sh(
                        script: "mktemp",
                        returnStdout: true
                    ).trim()
                    sh """
                        sed -e "s|<account-id>|${env.AWS_ACCOUNT_ID}|g" \
                            -e "s|<region>|${env.AWS_REGION}|g" \
                            -e "s|:latest|:${env.IMAGE_TAG}|g" \
                            ${env.KUBERNETES_DIR}/app-deployment.yaml > ${temp_deployment}
                    """
                    sh "kubectl apply -f ${temp_deployment}"
                    sh "rm -f ${temp_deployment}"
                }
                sh "kubectl apply -f ${env.KUBERNETES_DIR}/app-service.yaml"

                echo '🔄 Restarting deployment to consume updated configuration...'
                sh "kubectl rollout restart deployment/gym-profile-service -n ${env.NAMESPACE}"
                sh "kubectl rollout status deployment/gym-profile-service -n ${env.NAMESPACE} --timeout=120s"
            }
        }

        stage('Smoke Test') {
            steps {
                echo '🧪 Executing active endpoint smoke test...'
                sh "kubectl run smoke-profile --rm -i --restart=Never -n ${env.NAMESPACE} --image=curlimages/curl -- curl -sf http://gym-profile-service:4002/health"
            }
        }
    }

    post {
        success {
            echo "✅ gym-profile-service:${env.IMAGE_TAG} successfully deployed and healthy!"
        }
        failure {
            echo "❌ Deployment failed! Check the step diagnostics above."
        }
        always {
            sh "rm -f /tmp/profile-deployment-resolved.yaml || true"
        }
    }
}
