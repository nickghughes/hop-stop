# Credit lecture notes at https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog_web/controllers/session_controller.ex
defmodule HopStopWeb.SessionController do
  use HopStopWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    user = HopStop.Users.authenticate(email, password)
    if user do
      {:ok, token, _} = HopStopWeb.Guardian.encode_and_sign(user)
      session = %{
        user_id: user.id,
        name: user.name,
        token: token
      }
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{session: session, info: "Welcome back, #{user.name}!"})
      )
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Invalid email or password"})
      )
    end
  end
end