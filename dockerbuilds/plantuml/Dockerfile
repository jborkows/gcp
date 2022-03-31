FROM alpine:3.15.3


WORKDIR /app
COPY plantuml.sh plantuml
RUN apk --no-cache add \
    libstdc++ \
    tar \
    bash \
    fontconfig \
    ttf-dejavu \
    # && adduser -D -s /bin/bash  worker \
    # && wget https://cdn.azul.com/zulu/bin/zulu18.28.13-ca-jre18.0.0-linux_musl_x64.tar.gz -O java.tar.gz \
    && wget https://cdn.azul.com/zulu/bin/zulu11.54.25-ca-jre11.0.14.1-linux_musl_x64.tar.gz -O java.tar.gz \
    && tar -xzf java.tar.gz \
    && mv zul* jre \
    && rm  java.tar.gz \
    && wget https://github.com/plantuml/plantuml/releases/download/v1.2022.3/plantuml-1.2022.3.jar -O plantuml.jar \
    # && chown -R worker /app \
    && chmod u+x /app/plantuml
# USER worker
# WORKDIR /home/worker
# COPY  example.txt  /home/worker/example.txt
ENV JAVA_HOME=/app/jre/bin
ENV PLANT_UML_JAR=/app/plantuml.jar
ENV PATH=$PATH:/app
ENTRYPOINT [ "plantuml" ]