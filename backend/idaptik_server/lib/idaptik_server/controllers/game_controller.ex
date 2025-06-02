defmodule IdaptikServer.GameController do
  use IdaptikServerWeb, :controller

  alias IdaptikServer.{Repo, GameState}
  alias IdaptikServer.GameView

  # Fetches all game states and renders them as JSON.
  def index(conn, _params) do
    game_states = Repo.all(GameState)
    render(conn, "index.json", game_states: game_states)
  end

  # Fetches a single game state by its ID.
  def show(conn, %{"id" => id}) do
    case Repo.get(GameState, id) do
      nil ->
        send_resp(conn, :not_found, "Game state not found")
      game_state ->
        render(conn, "show.json", game_state: game_state)
    end
  end

  # Creates a new game state based on parameters sent in the request.
  def create(conn, %{"game_state" => game_state_params}) do
    changeset = GameState.changeset(%GameState{}, game_state_params)

    case Repo.insert(changeset) do
      {:ok, game_state} ->
        conn
        |> put_status(:created)
        |> render("show.json", game_state: game_state)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset.errors})
    end
  end
end
