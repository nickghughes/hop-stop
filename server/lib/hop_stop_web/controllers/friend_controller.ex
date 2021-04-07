defmodule HopStopWeb.FriendController do
  use HopStopWeb, :controller

  alias HopStop.Friends
  alias HopStop.Friends.Friend
  alias HopStop.Users

  action_fallback HopStopWeb.FallbackController

  def index(conn, _params) do
    user = Users.get_user_with_friends!(conn.assigns[:current_user].id)
    friends = %{
      pending_friends: Enum.map(user.pending_friendships,
                                fn x -> %{
                                  id: x.id,
                                  user_id: x.friendee.id,
                                  name: x.friendee.name,
                                  email: x.friendee.email
                                } end),
      pending_requests: Enum.map(user.pending_friend_requests,
                                fn x -> %{
                                  id: x.id,
                                  user_id: x.friender.id,
                                  name: x.friender.name,
                                  email: x.friender.email
                                } end),
      friends: Enum.map(user.frienders ++ user.friendees,
                                fn x -> %{
                                  id: x.id,
                                  name: x.name,
                                  email: x.email
                                } end)
    }
    conn
    |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
    |> send_resp(
      200,
      Jason.encode!(friends)
    )
  end

  def create(conn, %{"email" => email}) do
    user = Users.get_user_by_email(email)
    if user do
      friend_params = %{friender_id: conn.assigns[:current_user].id, friendee_id: user.id}
      with {:ok, %Friend{} = _} <- Friends.create_friend(friend_params) do      
        conn
        |> put_resp_header(
          "content-type",
          "application/json; charset=UTF-8")
        |> send_resp(
          :created,
          Jason.encode!(%{success: "Friend request sent!", user: %{id: user.id, name: user.name, email: user.email}})
        )
      end
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        404,
        Jason.encode!(%{error: "Could not find a user with that email"})
      )
    end
  end

  def update(conn, %{"id" => id, "response" => resp}) do
    friend = Friends.get_friend!(id)

    with {:ok, %Friend{} = _} <- Friends.update_friend(friend, %{accepted: resp}) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        200,
        Jason.encode!(%{success: "Friend request #{if resp, do: "accepted", else: "declined"}."})
      )
    end
  end

  # def delete(conn, %{"id" => id}) do
  #   friend = Friends.get_friend!(id)

  #   with {:ok, %Friend{}} <- Friends.delete_friend(friend) do
  #     send_resp(conn, :no_content, "")
  #   end
  # end
end
