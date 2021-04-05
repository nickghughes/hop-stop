defmodule HopStop.Favorites.Favorite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "favorites" do
    field :active, :boolean, default: false
    field :brewery_id, :integer

    belongs_to :user, HopStopWeb.Users.User

    timestamps()
  end

  @doc false
  def changeset(favorite, attrs) do
    favorite
    |> cast(attrs, [:brewery_id, :active, :user_id])
    |> validate_required([:brewery_id, :active, :user_id])
  end
end
