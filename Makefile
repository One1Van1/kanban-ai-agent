# 🚀 AI Kanban Agent - Development Commands
.PHONY: help start stop clean status install build test lint prod

# Default target
help: ## Show this help message
	@echo "🚀 AI Kanban Agent - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
	@echo ""

# Development commands
start: ## Start development environment
	@./scripts/start-dev.sh

stop: ## Stop development environment
	@./scripts/stop-dev.sh

clean: ## Clean up ports and processes
	@./scripts/clean-ports.sh

status: ## Check service status
	@./scripts/status.sh

# Installation commands
install: ## Install all dependencies
	@echo "📦 Installing Backend dependencies..."
	@cd kan-back && yarn install
	@echo "📦 Installing Frontend dependencies..."
	@cd kan-front && yarn install
	@echo "✅ All dependencies installed!"

# Build commands
build: ## Build both frontend and backend
	@echo "🔨 Building Backend..."
	@cd kan-back && yarn build
	@echo "🔨 Building Frontend..."
	@cd kan-front && yarn build
	@echo "✅ Build completed!"

# Test commands
test: ## Run all tests
	@echo "🧪 Running Backend tests..."
	@cd kan-back && yarn test
	@echo "🧪 Running Frontend tests..."
	@cd kan-front && yarn test
	@echo "✅ All tests completed!"

lint: ## Run linting
	@echo "🔍 Linting Backend..."
	@cd kan-back && yarn lint
	@echo "🔍 Linting Frontend..."
	@cd kan-front && yarn lint
	@echo "✅ Linting completed!"

# Production commands
prod: ## Start production build
	@echo "🚀 Starting production build..."
	@make build
	@echo "🌟 Starting production servers..."
	@cd kan-back && yarn start:prod &
	@cd kan-front && yarn start &
	@echo "✅ Production environment started!"

# Quick commands
dev: start ## Alias for start
up: start ## Alias for start
down: stop ## Alias for stop