defmodule HopStop.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :brewery_id, :integer, null: false
      add :body, :text, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:comments, [:user_id])
  end
end
