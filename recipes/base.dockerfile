FROM golang:1.18-buster as builder

# Create and change to the app directory.
WORKDIR /app

# Retrieve application dependencies.
# This allows the container build to reuse cached dependencies.
# Expecting to copy go.mod and if present go.sum.
COPY go.* ./
COPY . ./
RUN mkdir -p /cache/vendor \
    && go mod vendor \
    && mv vendor /cache/vendor \
    && mv go* /cache \
    && rm -rf * \
    && mv /cache/* .
