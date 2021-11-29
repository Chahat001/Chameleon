FROM openkbs/jdk-mvn-py3

COPY wait-for-it.sh /usr/wait-for-it.sh
RUN sudo chmod +x /usr/wait-for-it.sh

WORKDIR /srv

# Copy Python Files
ADD ./VirusDetection/ /srv/VirusDetection
ADD ./pyproject.toml /srv/pyproject.toml
ADD ./setup.py /srv/setup.py

#Python create virutal enviornment and Install python requirements
RUN sudo python3 -m venv ./
RUN pip install cython==0.25.2
RUN pip install numpy
RUN pip install .

# Copy Jar execeutable
ADD ./build/libs/uploading-files-0.0.1-SNAPSHOT.jar /srv/uploading-files-0.0.1-SNAPSHOT.jar
#CMD sudo java -jar /srv/uploading-files-0.0.1-SNAPSHOT.jar // overriden by the docker compose run commnad