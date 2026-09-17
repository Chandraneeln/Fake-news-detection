#!/bin/bash

# HONEST EYE - PRODUCTION DEPLOYMENT SCRIPT

set -e

echo \"🚀 Starting Honest Eye deployment...\"

# Check requirements
check_requirements() {
    if ! command -v docker &> /dev/null; then
        echo \"❌ Docker not found. Please install Docker first.\"
        exit 1
    fi
    echo \"✅ Docker found\"
}

# Check environment
check_environment() {
    if [ ! -f \"backend/.env\" ]; then
        echo \"⚠️  Creating .env from example...\"
        cp backend/.env.example backend/.env
        echo \"📝 Please edit backend/.env and add your Google API key\"
        read -p \"Press Enter after configuring...\"
    fi
    
    if grep -q \"your_google_api_key_here\" backend/.env; then
        echo \"❌ Please configure Google API key in backend/.env\"
        exit 1
    fi
    echo \"✅ Environment configured\"
}

# Deploy function
deploy() {
    echo \"🔨 Building containers...\"
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    
    echo \"🚀 Starting services...\"
    docker-compose up -d
    
    echo \"⏳ Waiting for services...\"
    sleep 15
    
    echo \"✅ Deployment completed!\"
    echo \"🌐 Frontend: http://localhost\"
    echo \"🚀 Backend: http://localhost:5000\"
}

# Main execution
main() {
    if [[ \"$1\" == \"--dev\" ]]; then
        docker-compose --profile dev up -d
        echo \"🔧 Development mode: http://localhost:8080\"
    else
        check_requirements
        check_environment
        deploy
    fi
}

main \"$@\"