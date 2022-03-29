FROM alpine:3.15.3


WORKDIR /
RUN apk --no-cache add \
    libstdc++ \
    curl \
    && curl https://static.snyk.io/cli/latest/snyk-alpine -o snyk \
    && chmod +x ./snyk \
    && mv ./snyk /usr/local/bin/
