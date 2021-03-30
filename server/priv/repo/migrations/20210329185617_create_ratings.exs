defmodule HopStop.Repo.Migrations.CreateRatings do
  use Ecto.Migration

  def change do
    create table(:ratings) do
      add :brewery_id, :integer, null: false
      add :stars, :integer, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:ratings, [:user_id])
    create index(:ratings, [:user_id, :brewery_id])
  end
end
