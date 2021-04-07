defmodule HopStop.Friends.Friend do
  use Ecto.Schema
  import Ecto.Changeset

  schema "friends" do
    field :accepted, :boolean
    belongs_to :friender, HopStop.Users.User
    belongs_to :friendee, HopStop.Users.User

    timestamps()
  end

  @doc false
  def changeset(friend, attrs) do
    friend
    |> cast(attrs, [:friender_id, :friendee_id, :accepted])
    |> validate_required([:friender_id, :friendee_id])
  end
end
