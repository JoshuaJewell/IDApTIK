# config/config.exs

import Config

# Configure the main application and Ecto repository.
config :idaptik_server,
  ecto_repos: [IdaptikServer.Repo]

# Configure the Phoenix endpoint.
config :idaptik_server, IdaptikServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "a_large_random_secret_key_here",
  render_errors: [view: IdaptikServerWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: IdaptikServer.PubSub,
  live_view: [signing_salt: "random_salt_here"]

# Configure Elixir’s Logger for console output.
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific configurations.
import_config "#{Mix.env()}.exs"
