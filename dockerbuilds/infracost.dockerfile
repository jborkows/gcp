FROM alpine:3.15.3


WORKDIR /
RUN apk --no-cache add \
    libstdc++ \
    curl \
    && curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh
