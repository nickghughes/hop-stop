defmodule HopStop.Friends.Friend do
  use Ecto.Schema
  import Ecto.Changeset

  schema "friends" do
    belongs_to :friender, HopStopWeb.Users.User
    belongs_to :friendee, HopStopWeb.Users.User

    timestamps()
  end

  @doc false
  def changeset(friend, attrs) do
    friend
    |> cast(attrs, [])
    |> validate_required([])
  end
end
