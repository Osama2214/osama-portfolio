# Portfolio Development Makefile

.PHONY: help install dev build clean docker-up docker-down test lint format

# Default target
help: ## Show this help message
	@echo "Portfolio Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing root dependencies..."
	npm install

# Development
dev: ## Start development servers
	npm run dev

dev-frontend: ## Start frontend development server only
	cd frontend && npm run dev

dev-backend: ## Start backend development server only
	cd backend && node server.js

# Building
build: ## Build for production
	cd frontend && npm run build

# Docker
docker-up: ## Start services with Docker Compose
	docker-compose up -d

docker-down: ## Stop Docker Compose services
	docker-compose down

docker-build: ## Build Docker images
	docker-compose build

# Quality Assurance
lint: ## Run ESLint
	cd frontend && npm run lint

format: ## Format code with Prettier
	cd frontend && npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

test: ## Run tests (if any)
	@echo "No tests configured yet"

# Cleanup
clean: ## Clean up generated files
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -rf frontend/dist
	rm -rf node_modules
	rm -rf backend/*.log

clean-docker: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -f

# Deployment
deploy: ## Deploy to production (configure as needed)
	@echo "Configure deployment in CI/CD pipeline"
	@echo "Current setup uses GitHub Actions for deployment"

# Database (if added later)
db-migrate: ## Run database migrations (if using a database)
	@echo "No database configured yet"

db-seed: ## Seed database with sample data (if using a database)
	@echo "No database configured yet"

# Environment
env-setup: ## Set up environment files
	cp .env.example .env
	cp frontend/.env.example frontend/.env 2>/dev/null || true
	cp backend/.env.example backend/.env 2>/dev/null || true
	@echo "Environment files created. Please edit them with your values."

# Git
git-status: ## Show git status
	git status

git-pull: ## Pull latest changes
	git pull origin main

git-push: ## Push changes
	git push origin main

# Info
info: ## Show project information
	@echo "Portfolio Project"
	@echo "================="
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:8000"
	@echo "Tech Stack: React, Node.js, Tailwind CSS"
	@echo ""
	@echo "Available commands:"
	@make help