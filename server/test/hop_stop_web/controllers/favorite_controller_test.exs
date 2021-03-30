defmodule HopStopWeb.FavoriteControllerTest do
  use HopStopWeb.ConnCase

  alias HopStop.Favorites
  alias HopStop.Favorites.Favorite

  @create_attrs %{
    active: true,
    brewery_id: 42
  }
  @update_attrs %{
    active: false,
    brewery_id: 43
  }
  @invalid_attrs %{active: nil, brewery_id: nil}

  def fixture(:favorite) do
    {:ok, favorite} = Favorites.create_favorite(@create_attrs)
    favorite
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all favorites", %{conn: conn} do
      conn = get(conn, Routes.favorite_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create favorite" do
    test "renders favorite when data is valid", %{conn: conn} do
      conn = post(conn, Routes.favorite_path(conn, :create), favorite: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.favorite_path(conn, :show, id))

      assert %{
               "id" => id,
               "active" => true,
               "brewery_id" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.favorite_path(conn, :create), favorite: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update favorite" do
    setup [:create_favorite]

    test "renders favorite when data is valid", %{conn: conn, favorite: %Favorite{id: id} = favorite} do
      conn = put(conn, Routes.favorite_path(conn, :update, favorite), favorite: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.favorite_path(conn, :show, id))

      assert %{
               "id" => id,
               "active" => false,
               "brewery_id" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, favorite: favorite} do
      conn = put(conn, Routes.favorite_path(conn, :update, favorite), favorite: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete favorite" do
    setup [:create_favorite]

    test "deletes chosen favorite", %{conn: conn, favorite: favorite} do
      conn = delete(conn, Routes.favorite_path(conn, :delete, favorite))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.favorite_path(conn, :show, favorite))
      end
    end
  end

  defp create_favorite(_) do
    favorite = fixture(:favorite)
    %{favorite: favorite}
  end
end
