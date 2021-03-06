#!/bin/bash

curl -v -X PUT $MARATHON_API_URL/v2/apps/shurenyun-$TASKENV-$SERVICE -H Content-Type:application/json -d \
'{
      "id": "shurenyun-'$TASKENV'-'$SERVICE'",
      "cpus": '$CPUS',
      "mem": '$MEM',
      "instances": '$INSTANCES',
      "constraints": [["hostname", "LIKE", "'$DEPLOYIP'"]],
      "container": {
                     "type": "DOCKER",
                     "docker": {
                                     "image": "'$SERVICE_IMAGE'",
                                     "network": "BRIDGE",
                                     "privileged": '$PRIVILEGED',
                                     "forcePullImage": '$FORCEPULLIMAGE',
                                     "portMappings": [
                                             { "containerPort": 80, "hostPort": 0, "protocol": "tcp"}
                                     ]
                                }
                   },
      "healthChecks": [{
                     "path": "/pics/logo-shurenyun.png",
                     "protocol": "HTTP",
                     "gracePeriodSeconds": 300,
                     "intervalSeconds": 60,
                     "portIndex": 0,
                     "timeoutSeconds": 20,
                     "maxConsecutiveFailures": 3
                 }],
      "env": {
                    "BAMBOO_PUBLIC": "'$BAMBOO_PUBLIC'",
                    "BAMBOO_PROXY":"'$BAMBOO_PROXY'",
                    "'$BAMBOO_PROTOCOL'":"true"
             },
      "uris": [
               "'$CONFIGSERVER'/config/demo/config/registry/docker.tar.gz"
       ]
}'
