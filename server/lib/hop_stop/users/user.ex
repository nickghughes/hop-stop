defmodule HopStop.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :bio, :string, default: ""
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :pfp_hash, :string

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
