FROM openjdk:11

# Create python virtual environment
RUN python -m venv ./
# Cython==0.25.2 and numpy is required for the installation of the hmms
RUN pip install cython==0.25.2
RUN pip install numpy

# Expose is only to tell developer to expose port
# all the port mapping happens at run time
EXPOSE 8080 
ADD ./build/libs/spring-mvc-0.1.jar /srv/spring-mvc-0.1.jar
CMD java -jar /srv/spring-mvc-0.1.jar