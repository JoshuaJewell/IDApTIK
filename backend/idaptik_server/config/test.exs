# config/test.exs

import Config

# Configure the database for tests.
config :idaptik_server, IdaptikServer.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "idaptik_server_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# Do not run a server during tests.
config :idaptik_server, IdaptikServerWeb.Endpoint,
  http: [port: 4002],
  server: false

# Configure logger level to only show warnings and errors.
config :logger, level: :warn
