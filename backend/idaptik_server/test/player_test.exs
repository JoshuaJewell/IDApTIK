defmodule IdaptikServer.PlayerTest do
  use ExUnit.Case, async: true

  alias IdaptikServer.Player

  describe "Player changeset" do
    test "returns a valid changeset with valid attributes" do
      valid_attrs = %{name: "Alice", score: 0}
      changeset = Player.changeset(%Player{}, valid_attrs)
      assert changeset.valid?
    end

    test "returns an invalid changeset when the name is missing" do
      changeset = Player.changeset(%Player{}, %{score: 10})
      refute changeset.valid?
    end
  end
end
