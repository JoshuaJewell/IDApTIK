defmodule IdaptikServer.Repo.Migrations.InitialMigration do
  use Ecto.Migration

  def change do
    # Create table for game state data
    create table(:game_states) do
      add :game_id, :string, null: false
      add :player_id, :string, null: false
      add :x, :float, null: false
      add :y, :float, null: false

      timestamps()
    end

    create index(:game_states, [:game_id])
    create index(:game_states, [:player_id])

    # Create table for player data
    create table(:players) do
      add :name, :string, null: false
      add :score, :integer, default: 0, null: false

      timestamps()
    end

    create unique_index(:players, [:name])
  end
end
