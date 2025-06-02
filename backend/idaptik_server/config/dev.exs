# config/dev.exs

import Config

# Configure the database for development.
config :idaptik_server, IdaptikServer.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "idaptik_server_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

# Configure the Phoenix endpoint for development:
# - Listen on port 4000.
# - Enable debugging, code reloading, and disable origin checking.
config :idaptik_server, IdaptikServerWeb.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: []

# Enable live reload of static assets and template files.
config :idaptik_server, IdaptikServerWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/idaptik_server_web/(live|views)/.*(ex)$",
      ~r"lib/idaptik_server_web/templates/.*(eex)$"
    ]
  ]

# In development, print only minimal logs to keep the console clean.
config :logger, :console, format: "[$level] $message\n"
