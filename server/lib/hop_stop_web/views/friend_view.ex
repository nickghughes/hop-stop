defmodule HopStopWeb.FriendView do
  use HopStopWeb, :view
  alias HopStopWeb.FriendView

  def render("index.json", %{friends: friends}) do
    %{data: render_many(friends, FriendView, "friend.json")}
  end

  def render("show.json", %{friend: friend}) do
    %{data: render_one(friend, FriendView, "friend.json")}
  end

  def render("friend.json", %{friend: friend}) do
    %{id: friend.id}
  end
end
