# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Docker development

Build the development image and start Nuxt:

```sh
docker compose -f docker/compose.yaml up --build
```

The app is available at [http://localhost:3000](http://localhost:3000). Source files are bind-mounted into the container, so Nuxt hot reload works without rebuilding the image.

The image installs the standalone Corepack package. Corepack reads the exact pnpm version from `package.json`, so development and image builds use the same package manager without requiring Node.js or pnpm on the host.

To use another host port, set `NUXT_PORT` when starting Compose:

```sh
NUXT_PORT=8080 docker compose -f docker/compose.yaml up --build
```

Stop the development environment with:

```sh
docker compose -f docker/compose.yaml down
```

Dependencies and Nuxt's generated development files live in Docker volumes. Rebuild the image after changing `package.json` or `pnpm-lock.yaml`:

```sh
docker compose -f docker/compose.yaml up --build
```

To also reset those volumes:

```sh
docker compose -f docker/compose.yaml down --volumes
```

## Manage dependencies

Run package-management commands inside the development container. For example, add a dependency with:

```sh
docker compose -f docker/compose.yaml exec app pnpm add <package>
```

Run Taze without installing it on the host:

```sh
docker compose -f docker/compose.yaml exec app pnpm dlx taze
```

## Production container

The production target builds Nuxt's Node server output and copies only that output into the runtime image. It runs as an unprivileged user and does not contain the application source or development dependencies.

Run the production image locally with the same restrictions expected from the deployed container:

```sh
docker compose -f docker/compose.production.yaml up --build --detach
```

Verify the application and its load-balancer health endpoint:

```sh
curl --fail http://localhost:3000/
curl --fail http://localhost:3000/healthz
```

Stop it with:

```sh
docker compose -f docker/compose.production.yaml down
```

To build an image for an external registry without Compose:

```sh
docker build --target production --tag create-nuxt:local .
```

The production container contract is:

- HTTP on container port `3000`;
- `GET /healthz` returns `200` when the Nuxt process is ready;
- configuration and secrets are supplied at runtime, never during the image build;
- logs are written to standard output and standard error;
- the filesystem can be read-only, with temporary storage available at `/tmp`;
- the process receives `SIGTERM` during shutdown and is given time to drain connections.

The AWS runtime should configure its target-group health check to use `/healthz`. TLS termination, WAF, networking, autoscaling, runtime secrets, and deployment strategy remain platform configuration rather than concerns embedded in this image. An nginx layer is not required when the container runs behind an ALB or equivalent managed reverse proxy.

## Direct production build

```sh
pnpm build
```
