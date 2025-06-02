defmodule IdaptikServer.GameState do
  use Ecto.Schema
  import Ecto.Changeset

  schema "game_states" do
    field :game_id, :string
    field :player_id, :string
    field :x, :float
    field :y, :float

    timestamps()
  end

  def changeset(game_state, attrs) do
    game_state
    |> cast(attrs, [:game_id, :player_id, :x, :y])
    |> validate_required([:game_id, :player_id, :x, :y])
  end
end
