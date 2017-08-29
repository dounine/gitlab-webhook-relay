#!/bin/bash
/root/issp/gitlab-webhook-relay/node_modules/forever/bin/forever start -a -l /var/log/forever.log /root/issp/gitlab-webhook-relay/index.js
