FROM node:12.2.0 as nodebuilder
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9
COPY . /app

RUN ng build --output-path=dist


FROM alpine:latest
MAINTAINER NEHA BHARDWAJ

ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk/jre \
    PATH=$PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin \
    JAVA_VERSION=8u222

EXPOSE 8080

RUN apk add --update bash wget tar openjdk8-jre && rm -rf /var/cache/apk/*

# Copy Jars
COPY --from=nodebuilder /app/dist /jetty/static_content
COPY entrypoint.sh /
RUN wget -q -O /jetty.tar.gz "https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/9.4.15.v20190215/jetty-distribution-9.4.15.v20190215.tar.gz"

# Install Jetty
RUN tar -xvf /jetty.tar.gz && rm /jetty.tar.gz && mv jetty-distribution-9.4.15.v20190215/* /jetty

COPY app.xml /jetty/webapps/
# Clean-Up
RUN chmod +x entrypoint.sh && apk del wget tar

CMD ["/jetty/bin/jetty.sh","run"]
