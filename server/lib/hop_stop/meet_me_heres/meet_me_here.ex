defmodule HopStop.MeetMeHeres.MeetMeHere do
  use Ecto.Schema
  import Ecto.Changeset

  schema "meetmeheres" do
    field :brewery_id, :integer

    belongs_to :user, HopStopWeb.Users.User
    belongs_to :rec, HopStopWeb.Users.User

    timestamps()
  end

  @doc false
  def changeset(meet_me_here, attrs) do
    meet_me_here
    |> cast(attrs, [:brewery_id])
    |> validate_required([:brewery_id])
  end
end
