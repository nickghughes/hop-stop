defmodule HopStop.Ratings.Rating do
  use Ecto.Schema
  import Ecto.Changeset

  schema "ratings" do
    field :brewery_id, :integer
    field :stars, :integer

    belongs_to :user, HopStopWeb.Users.User

    timestamps()
  end

  @doc false
  def changeset(rating, attrs) do
    rating
    |> cast(attrs, [:brewery_id, :stars])
    |> validate_required([:brewery_id, :stars])
  end
end
