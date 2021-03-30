defmodule HopStop.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :body, :string
    field :brewery_id, :integer

    belongs_to :user, HopStopWeb.Users.User

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:brewery_id, :body])
    |> validate_required([:brewery_id, :body])
  end
end
