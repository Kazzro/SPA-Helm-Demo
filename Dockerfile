#TODO add multi stage for building the app

FROM openjdk:21
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=backend/target/TodoApp-0.0.2-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]