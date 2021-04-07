defmodule HopStop.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias HopStop.Repo

  alias HopStop.Users.User

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  def authenticate(email, pass) do
    user = Repo.get_by(User, email: email)
    if user do
      case Argon2.check_pass(user, pass) do
        {:ok, user} -> user
        _ -> nil
      end
    else
      nil
    end
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  def get_user_with_friends!(id) do
    Repo.get!(User, id)
    |> Repo.preload [:friendees, :frienders, [pending_friendships: :friendee], [pending_friend_requests: :friender]]
  end

  def get_user_with_meet_me_heres!(id) do
    Repo.get!(User, id)
    |> Repo.preload [[incoming_invites: :user], [outgoing_invites: :rec]]
  end
end
