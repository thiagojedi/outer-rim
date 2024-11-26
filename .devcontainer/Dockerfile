FROM mcr.microsoft.com/devcontainers/typescript-node:20
COPY --from=denoland/deno:bin /deno /usr/local/bin/deno

ENV PATH=/home/node/.deno/bin:$PATH