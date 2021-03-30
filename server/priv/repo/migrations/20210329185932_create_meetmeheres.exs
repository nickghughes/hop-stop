defmodule HopStop.Repo.Migrations.CreateMeetmeheres do
  use Ecto.Migration

  def change do
    create table(:meetmeheres) do
      add :brewery_id, :integer, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false
      add :rec_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:meetmeheres, [:user_id])
    create index(:meetmeheres, [:rec_id])
  end
end
