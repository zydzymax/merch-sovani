.PHONY: help install dev build start deploy db-migrate db-seed db-studio docker-up docker-down lint format test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Run development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start

deploy: build ## Deploy to PM2
	pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js

db-migrate: ## Run database migrations
	npm run db:migrate

db-push: ## Push schema to database (without migrations)
	npm run db:push

db-seed: ## Seed database with demo data
	npm run db:seed

db-studio: ## Open Prisma Studio
	npm run db:studio

docker-up: ## Start Docker containers (postgres, redis)
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## Show Docker logs
	docker-compose logs -f

lint: ## Run ESLint
	npm run lint

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

test: ## Run tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

clean: ## Clean build artifacts
	rm -rf .next out node_modules/.cache

setup: install docker-up db-push db-seed ## Complete setup (install, docker, db, seed)
	@echo "Setup complete! Run 'make dev' to start development server"
