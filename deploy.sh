#!/bin/bash

# CMPC Backend Deployment Script for Google Cloud
# This script automates the deployment process to Google Cloud Platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-"strategic-arc-471303-m4"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="cmpc-backend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo -e "${BLUE}🚀 Starting CMPC Backend Deployment${NC}"
echo -e "${BLUE}Project ID: $PROJECT_ID${NC}"
echo -e "${BLUE}Region: $REGION${NC}"
echo -e "${BLUE}Service: $SERVICE_NAME${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists gcloud; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Set project
echo -e "${YELLOW}🔧 Setting Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push using Cloud Build
echo -e "${YELLOW}🏗️  Building and pushing image using Cloud Build...${NC}"
gcloud builds submit --config cloudbuild.yaml .

# Deploy to Cloud Run
echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 3000 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 1 \
    --set-env-vars NODE_ENV=production \
    --set-env-vars PORT=3000

# Get service URL
echo -e "${YELLOW}🔗 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Service URL: $SERVICE_URL${NC}"
echo -e "${GREEN}API Documentation: $SERVICE_URL/api${NC}"
echo ""

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
if curl -f -s "$SERVICE_URL/api/v1/books/test" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎯 Deployment Summary:${NC}"
echo -e "${GREEN}  • Project: $PROJECT_ID${NC}"
echo -e "${GREEN}  • Service: $SERVICE_NAME${NC}"
echo -e "${GREEN}  • Region: $REGION${NC}"
echo -e "${GREEN}  • URL: $SERVICE_URL${NC}"
echo -e "${GREEN}  • Image: $IMAGE_NAME:latest${NC}"
echo ""
echo -e "${BLUE}📚 Next steps:${NC}"
echo -e "${BLUE}  1. Update your frontend API URL to: $SERVICE_URL/api/v1${NC}"
echo -e "${BLUE}  2. Configure your domain (if needed)${NC}"
echo -e "${BLUE}  3. Set up monitoring and logging${NC}"
echo ""
