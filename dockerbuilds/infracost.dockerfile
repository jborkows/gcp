ARG PROJECT_ID
ARG TERRAFORM_BUILDER_VERSION
FROM gcr.io/$PROJECT_ID/terraformbuild:${TERRAFORM_BUILDER_VERSION}


WORKDIR /
RUN apk --no-cache add \
    libstdc++ \
    curl \
    && curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
