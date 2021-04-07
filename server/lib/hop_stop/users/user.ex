defmodule HopStop.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :bio, :string, default: ""
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :pfp_hash, :string

    has_many :friendships, HopStop.Friends.Friend, foreign_key: :friender_id, where: [accepted: true]
    has_many :friendees, through: [:friendships, :friendee]
    has_many :reverse_friendships, HopStop.Friends.Friend, foreign_key: :friendee_id, where: [accepted: true]
    has_many :frienders, through: [:reverse_friendships, :friender]

    has_many :pending_friendships, HopStop.Friends.Friend, foreign_key: :friender_id, where: [accepted: nil]
    has_many :pending_friends, through: [:pending_friendships, :friendee]
    has_many :pending_friend_requests, HopStop.Friends.Friend, foreign_key: :friendee_id, where: [accepted: nil]
    has_many :pending_requesters, through: [:pending_friend_requests, :friender]

    has_many :incoming_invites, HopStop.MeetMeHeres.MeetMeHere, foreign_key: :rec_id, where: [dismissed: false]
    has_many :outgoing_invites, HopStop.MeetMeHeres.MeetMeHere, foreign_key: :user_id, where: [dismissed: false]

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :password_hash, :pfp_hash, :email, :bio])
    |> add_password_hash(attrs["password"])
    |> validate_required([:name, :password_hash, :email])
  end

  def add_password_hash(cset, nil), do: cset

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end
