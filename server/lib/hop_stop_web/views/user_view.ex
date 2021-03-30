defmodule HopStopWeb.UserView do
  use HopStopWeb, :view
  alias HopStopWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{user: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email,
      pfp_hash: user.pfp_hash,
      bio: user.bio}
  end
end
