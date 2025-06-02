defmodule IdaptikServer.Application do
  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      IdaptikServer.Repo,
      # Start the Phoenix endpoint
      IdaptikServerWeb.Endpoint
      # You can add more workers or child supervisors here as needed.
    ]

    opts = [strategy: :one_for_one, name: IdaptikServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration when the application is updated.
  def config_change(changed, _new, removed) do
    IdaptikServerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
