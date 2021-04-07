defmodule HopStop.Repo.Migrations.CreateFriends do
  use Ecto.Migration

  def change do
    create table(:friends) do
      add :friender_id, references(:users, on_delete: :nothing), null: false
      add :friendee_id, references(:users, on_delete: :nothing), null: false
      add :accepted, :boolean

      timestamps()
    end

    create index(:friends, [:friender_id])
    create index(:friends, [:friendee_id])
    create unique_index(:friends, [:friender_id, :friendee_id])
  end
end
