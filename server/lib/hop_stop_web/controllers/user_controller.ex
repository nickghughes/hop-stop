defmodule HopStopWeb.UserController do
  use HopStopWeb, :controller

  alias HopStop.Users
  alias HopStop.Users.User

  action_fallback HopStopWeb.FallbackController

  plug :fetch_user when action in [:show, :update, :delete]
  plug :require_self when action in [:show]

  def fetch_user(conn, _params) do
    user = Users.get_user! conn.params["id"]
    assign conn, :user, user
  end

  def require_self(conn, _params) do
    if conn.assigns[:current_user] && conn.assigns[:current_user].id == conn.assigns[:user].id do
      conn  
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You can only view your own profile"})
      )
    end
  end

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    user_params = if user_params["pfp"] do
      {:ok, pfp_hash} = HopStop.ProfilePhotos.save_photo(
        user_params["pfp"].filename,
        user_params["pfp"].path
      )
      Map.put(user_params, "pfp_hash", pfp_hash)
    else
      user_params
    end

    user = conn.assigns[:user]

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
    render(conn, "show.json", user: conn.assigns[:user])
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user_params = if user_params["pfp"] do
      {:ok, pfp_hash} = HopStop.ProfilePhotos.save_photo(
        user_params["pfp"].filename,
        user_params["pfp"].path
      )
      Map.put(user_params, "pfp_hash", pfp_hash)
    else
      user_params
    end

    user = conn.assigns[:user]

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, %User{}} <- Users.delete_user(conn.assigns[:user]) do
      send_resp(conn, :no_content, "")
    end
  end

  def profile_photo(conn, %{"hash" => hash}) do
    {:ok, _name, data} = HopStop.ProfilePhotos.load_photo(hash)
    conn
    |> put_resp_content_type("image/jpeg")
    |> send_resp(200, data)
  end
end
