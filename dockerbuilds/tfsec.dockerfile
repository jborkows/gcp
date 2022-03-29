FROM golang:1.18.0-alpine3.15


WORKDIR /
RUN apk --no-cache add \
    libstdc++ \
    curl \
    && go install github.com/aquasecurity/tfsec/cmd/tfsec@latest 
