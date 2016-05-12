#############################################################
# DOCKERFILE FOR HEARTBEAT SERVICE
#############################################################
# DEPENDENCIES
# * NodeJS (provided)
#############################################################
# BUILD FLOW
# 3. Copy the service to the docker at /var/service
# 4. Run the default installatoin
# 5. Add the docker-startup.sh file which knows how to start
#    the service
#############################################################

FROM docker-registry.eyeosbcn.com/eyeos-fedora21-node-base

ENV WHATAMI heartbeat

WORKDIR ${InstallationDir}

RUN mkdir -p ${InstallationDir}/src/ && touch ${InstallationDir}/src/heartbeat-installed.js

COPY . ${InstallationDir}

RUN npm install --verbose && \
    npm install -g eyeos-run-server && \
    npm cache clean

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-heartbeat.js
