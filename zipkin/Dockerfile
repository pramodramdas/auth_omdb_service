FROM openjdk:8
CMD mkdir "/zip"
WORKDIR "/zip"
RUN curl -sSL https://zipkin.io/quickstart.sh | bash -s
EXPOSE 5454 9411
CMD ["java", "-jar", "zipkin.jar"]