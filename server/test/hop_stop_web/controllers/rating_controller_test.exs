defmodule HopStopWeb.RatingControllerTest do
  use HopStopWeb.ConnCase

  alias HopStop.Ratings
  alias HopStop.Ratings.Rating

  @create_attrs %{
    brewery_id: 42,
    stars: 42
  }
  @update_attrs %{
    brewery_id: 43,
    stars: 43
  }
  @invalid_attrs %{brewery_id: nil, stars: nil}

  def fixture(:rating) do
    {:ok, rating} = Ratings.create_rating(@create_attrs)
    rating
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all ratings", %{conn: conn} do
      conn = get(conn, Routes.rating_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create rating" do
    test "renders rating when data is valid", %{conn: conn} do
      conn = post(conn, Routes.rating_path(conn, :create), rating: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.rating_path(conn, :show, id))

      assert %{
               "id" => id,
               "brewery_id" => 42,
               "stars" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.rating_path(conn, :create), rating: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update rating" do
    setup [:create_rating]

    test "renders rating when data is valid", %{conn: conn, rating: %Rating{id: id} = rating} do
      conn = put(conn, Routes.rating_path(conn, :update, rating), rating: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.rating_path(conn, :show, id))

      assert %{
               "id" => id,
               "brewery_id" => 43,
               "stars" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, rating: rating} do
      conn = put(conn, Routes.rating_path(conn, :update, rating), rating: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete rating" do
    setup [:create_rating]

    test "deletes chosen rating", %{conn: conn, rating: rating} do
      conn = delete(conn, Routes.rating_path(conn, :delete, rating))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.rating_path(conn, :show, rating))
      end
    end
  end

  defp create_rating(_) do
    rating = fixture(:rating)
    %{rating: rating}
  end
end
