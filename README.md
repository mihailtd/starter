# Project Starter template - VueJS client, GraphQL backend, PostgreSQL database

Decisions:

- Repository: Monorepo structure using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and managed by [lerna](https://lerna.io/) (to be replaced by [Turborepo](https://turborepo.org/)
- Modern JS Framework with an ultra-fast build system: [VueJS](https://vuejs.org/) for the client-side, built with [Vite](https://vitejs.dev/)
- Functional/Utility Styles: Styles are handled by [TailwindCSS](https://tailwindcss.com/) and [PostCSS](https://postcss.org/)
- Database: High availability [PostgreSQL](https://www.postgresql.org/) in k8s using [CruncyData PGO](https://crunchydata.com/products/crunchy-postgresql-operator/)
- Server: Auto-generated GraphQL backend using [PostGraphile](https://www.graphile.org/)
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
    - `k8s/kustomization/overlays` - contains different overlays for the k8s manifests for each environment

## Developer experience

1. Code Editor and Extensions

- [VSCode](https://code.visualstudio.com/) - lightweight, open source code editor
- [Volar](https://marketplace.visualstudio.com/items?itemName=Volar) - VSCode extension for VueJS, offers intelligent code completion, code formatting, and code linting
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sql-tools) - VSCode extension for SQL, we use this for prettyfying SQL migrations

2. Developer Workflow

- The database is migrated in watch mode, every time a new migration file is edited, and the database is updated with the new migration.
- The GraphQL server is watching the database for changes and automatically updates the GraphQL schema.
- TypeScript Types and GraphQL Helpers are auto-generated using [graphql-code-generator](https://www.graphql-code-generator.com). This is also running in watch mode, every time a new type is added to the schema, the type is updated in the TypeScript types file giving you instant intellisense, code completion and type checking.
- The database and graphql schema files are stored in `schemas` folder. Even though these are auto-generated, it is reccomended that this is commited to the repository as you can then easily compare and diff and track the changes.

## Database amd Migrations

There are 4 database roles:

1. `postgres` - the postgres user that has root privileges - used for local development when watching the database for changes (this is not used in production)
2. `starter-owner` - this role owns the entire database, it runs all the migrations, owns the resulting schemas, tables and functions. This role is also used when function are run in `SECURITY DEFINER` mode.
3. `starter-server-authenticator` - this is the role that the GraphQL server connect to the database with. It has minimal permissions - only enough to run the introspection queries and can assume the starter-server role and authenticate users
4. `starter-server` - this is the role that the SQL queries are executed with and all the security policies should enforced for it (RBAC)

Database migrations are handled by [Graphile Migrate](https://github.com/graphile/migrate)

- All migrations should be written idempotently
- Workflow:
  - Write the SQL migration script
  - This is validated against the local DB
  - Commit the migration script
  - At the deployment stage, the migration script is applied to the remote DB

## Prerequisites

Have a Kubernetes cluster running locally - you can use Docker Desktop on windows or mac, or minikube on linux.
Have a Ingress Controller installed - this project has [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/) configured. If you choose a different ingress controller, you will need to update the annotations on the ingress manifests.
Have DevSpace CLI installed - Devspace is a CLI tool for managing k8s clusters, it was chosen as an alternative to Skaffold because it is easier to install, has alot of configuration possibilities, and is overall more user-friendly. See more infomration [here](https://devspace.sh/cli/docs/quickstart).

## Initial Setup

- Install all the required manifests in your kubernetes cluster under `k8s/manual` - this contains all resources that should be installed manually. Use `k apply -k ./k8s/manual/overlays/dev/` to install all manifests required for local development (check the `overlays` folder for different environments).
- Run `devspace use namespace starter` to switch to the namespace `starter` and instruct devspace to use it
- Run `devspace dev` to start the application in development mode. This will:
  - Build all docker images
  - Start the database and database migrations in watch mode
  - Start the GraphQL backend in watch mode
  - Start the GraphQL code generators in watch mode
  - Start the client application
  - Opens the urls in the browser
- Run `devspace purge` to remove all the resources that were installed in kubernetes, except the ones installed manually.

In order for the DNS to work, you will need add local DNS resolvers for the following domains:

1. `server.local.starter.com` - this is the domain that the GraphQL server is deployed to
2. `client.local.starter.com` - this is the domain that the client application is deployed to

## Continuous Integration and Continuous Deployment

To build all images and push them to the registry, run the following command: `devspace build -b -p staging` - this will force build all images and push them to the registry.

Workflow:
The code is started on a feature branch, a merge request is submitted. Each feature must come with it's own set of automated tests. As soon as it is merged into `main`, the automated tests are run and the code is deployed to the staging environment. At any point in time the code can be deployed to the production environment by merging the `main` branch in `production`.
ArgoCD keeps both the staging and production environments in sync based on the respective git branch.

Decisions:

1. Work on a feature starts on a feature branch, as soon as it is merged in `main` it is deployed to the staging environment.
1. Development images are created by DevSpace. They are tagged with the current commit hash, and are not uploaded to the registry.
1. The `main` branch is what is currently released in staging, this is done automatically by ArgoCD
1. As soon as a feature branch is merged in `main`, CI jobs are triggered for:
1. creating images and uploading them to the registry
1. updating the kustomize overlay files with the new images
1. run the automated tests in staging
1. Production deployments are triggered by merging the `main` branch in `production` branch.
1. in order to achieve the real contnuous deployment, this last step needs to be eliminated. This can only be done when there is enough confidence in the automated tests so that the deployment can be done without manual intervention, at which point there is no need for separate `main` and `production` branches.

## TO-DO

1. [TODO] initialize SQL is not working
2. [TODO] use PgBouncer to handle connections to the DB
3. [TODO] use TLS for the DB connection
4. [TODO] define the IP in pg_hba.conf
5. [TODO] define a better eslint config
6. [TODO] configure HTTPS for local development
7. [TODO] see if you can tag images separately, based on something other than commit hash, in order to update the images only when changes to the specific sub-directories are made, not on every commit.
8. [TODO] currently the staging / production docker images are built locally using DevSpace CLI, this should run in a CI pipeline.

# Known issues and quirks

1. Database migrations can't easily be rolled back. This is the case for most SQL migrations as they involve migrating the data as well as the schema. The solution is to create a new migration file that contains the rollback statements.
2. Sometimes changes to the pods apply only after deleting them and letting them re-create. This is probably because the containers have the same tags even after re-building them. If something does not seem to be synchronized even after deleting the pod, try running `devspace purge` and start again.
3. If VS Code intellisense does not see the new generated types, try restarting VS Code, either a full restart, or better yet, open the comand pallet with `ctrl + shift + P` and type "reload window" and execute that to reload the current window faster than a full restart.
