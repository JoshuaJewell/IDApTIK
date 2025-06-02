defmodule IdaptikServer.GameView do
  use IdaptikServerWeb, :view

  # Renders a collection of game states in JSON format.
  def render("index.json", %{game_states: game_states}) do
    %{
      data: render_many(game_states, __MODULE__, "game_state.json")
    }
  end

  # Renders a single game state in JSON format.
  def render("show.json", %{game_state: game_state}) do
    %{
      data: render_one(game_state, __MODULE__, "game_state.json")
    }
  end

  # Defines the JSON representation for a single game state.
  def render("game_state.json", %{game_state: game_state}) do
    %{
      id: game_state.id,
      game_id: game_state.game_id,
      player_id: game_state.player_id,
      x: game_state.x,
      y: game_state.y,
      inserted_at: game_state.inserted_at,
      updated_at: game_state.updated_at
    }
  end
end
