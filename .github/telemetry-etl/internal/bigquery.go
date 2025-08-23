# Stage 1: Build the Go application
FROM golang:1.22 AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o telemetry-etl .

# Stage 2: Create a minimal image
FROM gcr.io/distroless/base

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/telemetry-etl .

# Command to run the application
CMD ["/app/telemetry-etl"]