FROM golang:1.18-buster as builder

# Create and change to the app directory.
WORKDIR /app

# Retrieve application dependencies.
# This allows the container build to reuse cached dependencies.
# Expecting to copy go.mod and if present go.sum.
COPY go.* ./
COPY . ./
RUN go mod vendor \
    && mv vendor /cache \
    && rm -rf * \
    && mv /cache vendor
