#!/bin/sh
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = { reloadInterval: ${POLL_INTERVAL:-30} };
EOF
