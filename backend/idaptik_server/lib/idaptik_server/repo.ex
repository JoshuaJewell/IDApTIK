defmodule IdaptikServer.Repo do
  use Ecto.Repo,
    otp_app: :idaptik_server,
    adapter: Ecto.Adapters.Postgres
end
