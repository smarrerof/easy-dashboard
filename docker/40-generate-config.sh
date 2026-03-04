#!/bin/sh
APP_VERSION="${APP_VERSION:-dev}"
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = { reloadInterval: ${POLL_INTERVAL:-30}, appVersion: "${APP_VERSION}" };
EOF
