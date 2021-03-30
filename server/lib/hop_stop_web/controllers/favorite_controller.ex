defmodule HopStopWeb.FavoriteController do
  use HopStopWeb, :controller

  alias HopStop.Favorites
  alias HopStop.Favorites.Favorite

  action_fallback HopStopWeb.FallbackController

  def index(conn, _params) do
    favorites = Favorites.list_favorites()
    render(conn, "index.json", favorites: favorites)
  end

  def create(conn, %{"favorite" => favorite_params}) do
    with {:ok, %Favorite{} = favorite} <- Favorites.create_favorite(favorite_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.favorite_path(conn, :show, favorite))
      |> render("show.json", favorite: favorite)
    end
  end

  def show(conn, %{"id" => id}) do
    favorite = Favorites.get_favorite!(id)
    render(conn, "show.json", favorite: favorite)
  end

  def update(conn, %{"id" => id, "favorite" => favorite_params}) do
    favorite = Favorites.get_favorite!(id)

    with {:ok, %Favorite{} = favorite} <- Favorites.update_favorite(favorite, favorite_params) do
      render(conn, "show.json", favorite: favorite)
    end
  end

  def delete(conn, %{"id" => id}) do
    favorite = Favorites.get_favorite!(id)

    with {:ok, %Favorite{}} <- Favorites.delete_favorite(favorite) do
      send_resp(conn, :no_content, "")
    end
  end
end
