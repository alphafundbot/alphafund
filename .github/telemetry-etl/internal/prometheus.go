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