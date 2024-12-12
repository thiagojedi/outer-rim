FROM mcr.microsoft.com/devcontainers/base:ubuntu
COPY --from=denoland/deno:bin /deno /usr/local/bin/deno

ENV PATH=/home/node/.deno/bin:$PATH