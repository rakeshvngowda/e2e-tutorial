# e2e-tutorial

A minimal Express.js service that responds with a JSON hello message. Includes a Dockerfile and a Kubernetes Deployment manifest for running in a local cluster (kind or minikube).

## 1. Prerequisites
- Node.js (optional if only running via Docker) – project targets Node 24 (Docker base image `node:24-alpine`).
- Docker
- kubectl
- A local Kubernetes cluster (choose one):
  - kind
  - minikube

## 2. Install dependencies (optional if only building Docker image)
```bash
npm install
```

## 3. Run locally (without Docker)
```bash
npm start
# Server runs on http://localhost:3000
curl http://localhost:3000/
```
Expected response:
```json
{"message":"Hello, World!"}
```

## 4. Run the simple test
```bash
npm test
```
Outputs `OK` on success.

## 5. Build the Docker image
From the project root (Dockerfile is at root):
```bash
docker build -t e2e-tutorial:latest .
```

## 6. Load the image into your local cluster
Because the Deployment uses `imagePullPolicy: Never`, the cluster must already have the image. Use one of the methods below.

### Option A: kind
```bash
kind create cluster            # if not already created
kind load docker-image e2e-tutorial:latest
```

### Option B: minikube
Build inside the minikube Docker daemon so the image is directly available:
```bash
minikube start                 # if not already running
eval "$(minikube docker-env)"
docker build -t e2e-tutorial:latest .
```
(Disable the docker-env later with `eval "$(minikube docker-env -u)"`.)

## 7. Deploy to Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
kubectl rollout status deployment/e2e-tutorial
kubectl get pods -l app=e2e-tutorial
```

## 8. Access the service
This manifest does not create a Service. Use a temporary port-forward:
```bash
kubectl port-forward deployment/e2e-tutorial 3000:3000
```
Then:
```bash
curl http://localhost:3000/
```

## 9. (Optional) Create a ClusterIP Service
If you want a persistent Service, create `k8s/service.yaml` like:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: e2e-tutorial
spec:
  selector:
    app: e2e-tutorial
  ports:
  - port: 3000
    targetPort: 3000
```
Apply it:
```bash
kubectl apply -f k8s/service.yaml
kubectl get svc e2e-tutorial
```

## 10. Cleanup
```bash
kubectl delete -f k8s/deployment.yaml
# If you created a service:
kubectl delete svc e2e-tutorial
# Delete cluster if desired:
kind delete cluster        # or: minikube delete
```

## 11. Troubleshooting
- Image not found: Ensure you loaded or built the image inside the cluster context (step 6).
- Pods CrashLoopBackOff: Check logs: `kubectl logs <pod-name>`.
- Port already in use on host: Change the forwarded port (e.g., `kubectl port-forward deployment/e2e-tutorial 8080:3000`).

## 12. Next Steps (Optional Enhancements)
- Add readiness/liveness probes to Deployment.
- Add resource requests/limits for production.
- Add a Service + Ingress for external access.
- Expand tests (HTTP endpoint response validation).

---
Minimal end-to-end path:
```bash
docker build -t e2e-tutorial:latest .
kind create cluster
kind load docker-image e2e-tutorial:latest
kubectl apply -f k8s/deployment.yaml
kubectl port-forward deployment/e2e-tutorial 3000:3000
curl http://localhost:3000/
```
