FROM mcr.microsoft.com/devcontainers/base:ubuntu
COPY --from=docker.io/denoland/deno:bin /deno /usr/local/bin/deno

ENV PATH=/home/node/.deno/bin:$PATH