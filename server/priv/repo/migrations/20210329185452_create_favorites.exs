defmodule HopStop.Repo.Migrations.CreateFavorites do
  use Ecto.Migration

  def change do
    create table(:favorites) do
      add :brewery_id, :integer, null: false
      add :active, :boolean, default: true, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:favorites, [:user_id])
    create index(:favorites, [:user_id, :brewery_id])
  end
end
