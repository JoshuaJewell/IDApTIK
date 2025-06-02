defmodule IdaptikServer.PlayerController do
  use IdaptikServerWeb, :controller

  alias IdaptikServer.{Repo, Player}
  alias IdaptikServer.PlayerView

  # Returns a list of players.
  def index(conn, _params) do
    players = Repo.all(Player)
    render(conn, "index.json", players: players)
  end

  # Returns a single player by ID.
  def show(conn, %{"id" => id}) do
    case Repo.get(Player, id) do
      nil ->
        send_resp(conn, :not_found, "Player not found")
      player ->
        render(conn, "show.json", player: player)
    end
  end

  # Creates a new player record.
  def create(conn, %{"player" => player_params}) do
    changeset = Player.changeset(%Player{}, player_params)

    case Repo.insert(changeset) do
      {:ok, player} ->
        conn
        |> put_status(:created)
        |> render("show.json", player: player)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset.errors})
    end
  end
end
