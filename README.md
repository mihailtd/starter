# VueJS client, GraphQL backend, PostgreSQL database Starter

Decisions:

1. Monorepo structure
2. VueJS for the client-side
3. Database - PostgreSQL high availability in k8s using [CruncyData PGO](https://crunchydata.com/products/crunchy-postgresql-operator/)
4. Auto-generated GraphQL backend using Postgraphile
5. Kubernetes for dev and production
6. Devspace as an alternative to skaffold
7. CI/CD with [Gitlab CI/CD](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
8. [GCP](https://cloud.google.com/docs/authentication/getting-started) as the cloud provider of choice - managed k8s clusters, storage, firebase authentication, google maps API etc.

# DB Migration

# Developer experience

1. Code Editor and Extensions

- [VSCode](https://code.visualstudio.com/) - lightweight, open source code editor
- [Volar](https://marketplace.visualstudio.com/items?itemName=Volar) - VSCode extension for VueJS, offers intelligent code completion, code formatting, and code linting
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sql-tools) - VSCode extension for SQL, we use this for prettyfying SQL migrations

### Prerequisites

Have a Kubernetes cluster running locally

### Initial Setup

- Install all the required manifests in your kubernetes cluster under `k8s/manual` - this contains all resources that should be installed manually. Use `k apply -k ./k8s/manual/`
- Switch to the namespace `starter` and instruct devspace to use it using `devspace use namespace starter`
- Run `devspace dev` to start the application in development mode. This will:
  - Install all the required dependencies
  - Start the database
  - Start the GraphQL backend
  - Start the client-side
- Run `devspace purge` to remove all the resources that were installed in kubernetes, except the ones installed manually.
