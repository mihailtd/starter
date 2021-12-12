# Project Starter template - VueJS client, GraphQL backend, PostgreSQL database

Decisions:

1. Monorepo structure using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and managed by [lerna](https://lerna.io/) (could be replaced by [turborepo](https://turborepo.org/)
2. [VueJS](https://vuejs.org/) for the client-side
3. Database - high availability [PostgreSQL](https://www.postgresql.org/) in k8s using [CruncyData PGO](https://crunchydata.com/products/crunchy-postgresql-operator/)
4. Auto-generated GraphQL backend using [Postgraphile](https://www.graphile.org/)
5. [Kubernetes](https://kubernetes.io/) for local development using [DevSpace](https://devspace.sh/) as well as deployment to [GKE](https://cloud.google.com/kubernetes-engine/)
6. CI/CD with [Gitlab CI/CD](https://docs.gitlab.com/)
7. [GCP](https://cloud.google.com/) as the cloud provider of choice - managed k8s clusters, storage, firebase authentication, google maps API etc.

## DB Migration

Database migrations are handled by [Graphile Migrate](https://github.com/graphile/migrate)

## Developer experience

1. Code Editor and Extensions

- [VSCode](https://code.visualstudio.com/) - lightweight, open source code editor
- [Volar](https://marketplace.visualstudio.com/items?itemName=Volar) - VSCode extension for VueJS, offers intelligent code completion, code formatting, and code linting
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sql-tools) - VSCode extension for SQL, we use this for prettyfying SQL migrations

2. Developer Workflow

- The database is migrated in watch more, every time a new migration file is edited, and the database is updated with the new migration.
- The GraphQL server is watching the database for changes and automatically updates the GraphQL schema.
- TypeScript Types and GraphQL Helpers are auto-generated using [graphql-code-generator](https://www.graphql-code-generator.com). This is also running in watch mode, every time a new type is added to the schema, the type is updated in the TypeScript types file giving you instant intellisense, code completion, and type checking.

## Prerequisites

Have a Kubernetes cluster running locally.
Have DevSpace CLI installed.

## Initial Setup

- Install all the required manifests in your kubernetes cluster under `k8s/manual` - this contains all resources that should be installed manually. Use `kubectl apply -k ./k8s/manual/`
- Switch to the namespace `starter` and instruct devspace to use it using `devspace use namespace starter`
- Run `devspace dev` to start the application in development mode. This will:
  - Install all the required dependencies
  - Start the database
  - Start the GraphQL backend
  - Start the client-side
- Run `devspace purge` to remove all the resources that were installed in kubernetes, except the ones installed manually.
