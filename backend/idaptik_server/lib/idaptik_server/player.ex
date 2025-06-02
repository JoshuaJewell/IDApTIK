defmodule IdaptikServer.Player do
  use Ecto.Schema
  import Ecto.Changeset

  schema "players" do
    field :name, :string
    field :score, :integer, default: 0

    timestamps()
  end

  def changeset(player, attrs) do
    player
    |> cast(attrs, [:name, :score])
    |> validate_required([:name])
    |> unique_constraint(:name)
  end
end
