# config/prod.exs

import Config

# Configure the Phoenix endpoint for production.
config :idaptik_server, IdaptikServerWeb.Endpoint,
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [socket_opts: [:inet6]]
  ],
  secret_key_base:
    System.get_env("SECRET_KEY_BASE") ||
      "PLEASE_GENERATE_A_SECRET_KEY_BASE_FOR_PRODUCTION",
  server: true,
  url: [host: "example.com", port: 80],
  cache_static_manifest: "priv/static/cache_manifest.json"

# Configure the database for production.
config :idaptik_server, IdaptikServer.Repo,
  url: System.get_env("DATABASE_URL"),
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
  ssl: false  # Adjust to true if required by your database setup
