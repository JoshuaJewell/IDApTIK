defmodule IdaptikServer.GameTest do
  use ExUnit.Case, async: true

  alias IdaptikServer.GameState

  describe "GameState changeset" do
    test "returns a valid changeset when given valid attributes" do
      valid_attrs = %{game_id: "game1", player_id: "player1", x: 100.0, y: 200.0}
      changeset = GameState.changeset(%GameState{}, valid_attrs)
      assert changeset.valid?
    end

    test "returns an invalid changeset when required attributes are missing" do
      changeset = GameState.changeset(%GameState{}, %{})
      refute changeset.valid?
    end
  end
end
