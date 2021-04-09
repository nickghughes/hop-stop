defmodule HopStop.MeetMeHeres do
  @moduledoc """
  The MeetMeHeres context.
  """

  import Ecto.Query, warn: false
  alias HopStop.Repo

  alias HopStop.MeetMeHeres.MeetMeHere

  @doc """
  Returns the list of meetmeheres.

  ## Examples

      iex> list_meetmeheres()
      [%MeetMeHere{}, ...]

  """
  def list_meetmeheres do
    Repo.all(MeetMeHere)
  end

  @doc """
  Gets a single meet_me_here.

  Raises `Ecto.NoResultsError` if the Meet me here does not exist.

  ## Examples

      iex> get_meet_me_here!(123)
      %MeetMeHere{}

      iex> get_meet_me_here!(456)
      ** (Ecto.NoResultsError)

  """
  def get_meet_me_here!(id), do: Repo.get!(MeetMeHere, id)

  @doc """
  Creates a meet_me_here.

  ## Examples

      iex> create_meet_me_here(%{field: value})
      {:ok, %MeetMeHere{}}

      iex> create_meet_me_here(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_meet_me_here(attrs \\ %{}) do
    %MeetMeHere{}
    |> MeetMeHere.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a meet_me_here.

  ## Examples

      iex> update_meet_me_here(meet_me_here, %{field: new_value})
      {:ok, %MeetMeHere{}}

      iex> update_meet_me_here(meet_me_here, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_meet_me_here(%MeetMeHere{} = meet_me_here, attrs) do
    meet_me_here
    |> MeetMeHere.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a meet_me_here.

  ## Examples

      iex> delete_meet_me_here(meet_me_here)
      {:ok, %MeetMeHere{}}

      iex> delete_meet_me_here(meet_me_here)
      {:error, %Ecto.Changeset{}}

  """
  def delete_meet_me_here(%MeetMeHere{} = meet_me_here) do
    Repo.delete(meet_me_here)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking meet_me_here changes.

  ## Examples

      iex> change_meet_me_here(meet_me_here)
      %Ecto.Changeset{data: %MeetMeHere{}}

  """
  def change_meet_me_here(%MeetMeHere{} = meet_me_here, attrs \\ %{}) do
    MeetMeHere.changeset(meet_me_here, attrs)
  end
end
