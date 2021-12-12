# Project Starter template - VueJS client, GraphQL backend, PostgreSQL database

Decisions:

- Repository: Monorepo structure using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and managed by [lerna](https://lerna.io/) (to be replaced by [turborepo](https://turborepo.org/)
- Modern JS Framework with an ultra-fast build system: [VueJS](https://vuejs.org/) for the client-side, built with [Vite](https://vitejs.dev/)
- Functional/Utility Styles: Styles are handled by [TailwindCSS](https://tailwindcss.com/) and [PostCSS](https://postcss.org/)
- Database: High availability [PostgreSQL](https://www.postgresql.org/) in k8s using [CruncyData PGO](https://crunchydata.com/products/crunchy-postgresql-operator/)
- Server: Auto-generated GraphQL backend using [Postgraphile](https://www.graphile.org/)
- Database-driven development: everything starts with the database schema and the GraphQL backend is built from that
- [Kubernetes](https://kubernetes.io/) for local development using [DevSpace](https://devspace.sh/) as well as deployment to [GKE](https://cloud.google.com/kubernetes-engine/)
- Automation: CI/CD with [Gitlab CI/CD](https://docs.gitlab.com/) and E2E tests with [cypress](https://www.cypress.io/)
- Deployment: [GCP](https://cloud.google.com/) as the cloud provider of choice - managed k8s clusters, storage, firebase authentication, google maps API etc

Project structure:

- `@app` - contains all the individual apps
  - `@app/client` - contains the client-side code
  - `@app/db` - contains the database migration scripts
  - `@app/e2e` - contains the end-to-end tests
  - `app/gql` - contains the auto-generated Typescript client side code and types
  - `@app/server` - contains the server-side code
- `schemas` - this folder stores the auto-generated GraphQL and database schemas
- `docker` - this folder contains the docker images for the apps
- `k8s` - this folder contains the k8s manifests
  - `k8s/manual` - contains the k8s manifests that should be manually applied
  - `k8s/kustomization` - contains the k8s manifests that should be applied automatically by DevSpace

## Developer experience

1. Code Editor and Extensions

- [VSCode](https://code.visualstudio.com/) - lightweight, open source code editor
- [Volar](https://marketplace.visualstudio.com/items?itemName=Volar) - VSCode extension for VueJS, offers intelligent code completion, code formatting, and code linting
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sql-tools) - VSCode extension for SQL, we use this for prettyfying SQL migrations

2. Developer Workflow

- The database is migrated in watch more, every time a new migration file is edited, and the database is updated with the new migration.
- The GraphQL server is watching the database for changes and automatically updates the GraphQL schema.
- TypeScript Types and GraphQL Helpers are auto-generated using [graphql-code-generator](https://www.graphql-code-generator.com). This is also running in watch mode, every time a new type is added to the schema, the type is updated in the TypeScript types file giving you instant intellisense, code completion and type checking.

## DB Migration

Database migrations are handled by [Graphile Migrate](https://github.com/graphile/migrate)

- All migrations should be written idempotently
- Workflow:
  - Write the SQL migration script
  - This is validated against the local DB
  - Commit the migration script
  - At the deployment stage, the migration script is applied to the remote DB

## Prerequisites

Have a Kubernetes cluster running locally.
Have DevSpace CLI installed.

## Initial Setup

- Install all the required manifests in your kubernetes cluster under `k8s/manual` - this contains all resources that should be installed manually. Use `kubectl apply -k ./k8s/manual/`
- Switch to the namespace `starter` and instruct devspace to use it using `devspace use namespace starter`
- Run `devspace dev` to start the application in development mode. This will:
  - Build all docker images
  - Start the database and database migrations in watch mode
  - Start the GraphQL backend in watch mode
  - Start the GraphQL code generators in watch mode
  - Start the client application
  - Opens the urls in the browser
- Run `devspace purge` to remove all the resources that were installed in kubernetes, except the ones installed manually.
