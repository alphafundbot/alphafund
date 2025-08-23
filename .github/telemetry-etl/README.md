### Minimal Dockerfile

This Dockerfile uses a multi-stage build to keep the final image lightweight.

```dockerfile
# Stage 1: Build the Go application
FROM golang:1.22 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o telemetry-etl .

# Stage 2: Create a minimal image
FROM gcr.io/distroless/base

COPY --from=builder /app/telemetry-etl /telemetry-etl
ENTRYPOINT ["/telemetry-etl"]
```

### Cloud Scheduler to Workflows Snippet

This snippet creates a Cloud Scheduler job that triggers a Cloud Run Job using Google Cloud Workflows.

1. **Create a Workflow**: First, create a workflow that triggers your Cloud Run Job.

```yaml
# workflow.yaml
main:
  params: [input]
  steps:
    - init:
        assign:
          - project: "YOUR_PROJECT_ID"
          - location: "YOUR_REGION"
          - service: "YOUR_CLOUD_RUN_SERVICE_NAME"
          - job: "YOUR_CLOUD_RUN_JOB_NAME"
    - triggerJob:
        call: google.cloud.run.jobs.run
        args:
          name: ${job}
          location: ${location}
          project: ${project}
```

2. **Deploy the Workflow**:

```bash
gcloud workflows deploy trigger-cloud-run-job \
  --source=workflow.yaml \
  --location=YOUR_REGION
```

3. **Create a Cloud Scheduler Job**:

```bash
gcloud scheduler jobs create http trigger-cloud-run-job \
  --schedule="0 0 * * *" \
  --uri="https://workflowexecutions.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/YOUR_REGION/executions" \
  --http-method=POST \
  --message-body='{"input": {}}' \
  --time-zone="UTC" \
  --oidc-service-account-email=YOUR_SERVICE_ACCOUNT_EMAIL
```

### GitHub Actions Workflow for Zero-Ops Nightly Run

This GitHub Actions workflow triggers the ETL job nightly.

```yaml
name: Nightly ETL Run

on:
  schedule:
    - cron: '0 0 * * *'  # Runs at midnight UTC

jobs:
  run-etl:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Go
        uses: actions/setup-go@v2
        with:
          go-version: '1.22'

      - name: Build the Docker image
        run: |
          docker build -t gcr.io/YOUR_PROJECT_ID/telemetry-etl:latest .

      - name: Push Docker image
        run: |
          echo ${{ secrets.GCP_SA_KEY }} | gcloud auth activate-service-account --key-file=-
          gcloud auth configure-docker
          docker push gcr.io/YOUR_PROJECT_ID/telemetry-etl:latest

      - name: Trigger Cloud Run Job
        run: |
          gcloud run jobs execute YOUR_CLOUD_RUN_JOB_NAME --region YOUR_REGION --project YOUR_PROJECT_ID
```

### Notes

1. **Replace placeholders**: Make sure to replace `YOUR_PROJECT_ID`, `YOUR_REGION`, `YOUR_CLOUD_RUN_SERVICE_NAME`, `YOUR_CLOUD_RUN_JOB_NAME`, and `YOUR_SERVICE_ACCOUNT_EMAIL` with your actual values.

2. **Secrets Management**: Store sensitive information like `GCP_SA_KEY` in GitHub Secrets for security.

3. **Testing**: Before deploying, test each component separately to ensure everything works as expected.

This setup should provide a robust and automated ETL pipeline for your telemetry data. If you have any further questions or need additional assistance, feel free to ask!