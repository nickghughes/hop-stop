defmodule HopStopWeb.UserController do
  use HopStopWeb, :controller

  alias HopStop.Users
  alias HopStop.Users.User

  action_fallback HopStopWeb.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    user_params = if user_params["pfp"] do
      IO.inspect user_params["pfp"]
      {:ok, pfp_hash} = HopStop.ProfilePhotos.save_photo(
        user_params["pfp"].filename,
        user_params["pfp"].path
      )
      Map.put(user_params, "pfp_hash", pfp_hash)
    else
      user_params
    end

    with {:ok, %User{} = user} <- Users.create_user(user_params) do
      {:ok, token, _} = HopStopWeb.Guardian.encode_and_sign(user)
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{
          session: %{ user_id: user.id, name: user.name, token: token },
          success: "Registered Successfully. Welcome, #{user.name}!"
        })
      )
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
