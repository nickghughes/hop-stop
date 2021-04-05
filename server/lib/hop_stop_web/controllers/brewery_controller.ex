defmodule HopStopWeb.BreweryController do
  use HopStopWeb, :controller

  action_fallback HopStopWeb.FallbackController

  alias HopStop.BreweryApi
  alias HopStop.Favorites
  alias HopStop.Reviews

  # Search
  def index(conn, args) do
    page = if args["page"], do: String.to_integer(args["page"]), else: 1
    results = cond do
      args["favorite"] == "true" ->
        ids = Favorites.get_by_user(conn.assigns[:current_user].id, page-1)
        |> Enum.map(fn x -> x.brewery_id end)

        breweries = if length(ids) > 0 do
          BreweryApi.get_ids(ids)
        else
          []
        end
        %{results: breweries, page: page}
      args["searchTerm"] -> 
        breweries = BreweryApi.by_search_term(args["searchTerm"])
        %{results: breweries, page: page}
      true -> BreweryApi.location_to_breweries(args)
    end
    conn
    |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
    |> send_resp(
      200,
      Jason.encode!(%{data: results})
    )
  end

  # Dedicated Page
  def show(conn, %{"id" => id}) do
    result = BreweryApi.get_brewery(id)
    if result["id"] do
      favorite = Favorites.get_favorite_by_user_brewery(conn.assigns[:current_user].id, id)
      review = Reviews.get_review_by_user_brewery(conn.assigns[:current_user].id, id)
      result = result
      |> Map.put("review", (if review, do: %{id: review.id, body: review.body, stars: review.stars}, else: nil))
      |> Map.put("favorite", favorite != nil && favorite.active)
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        200,
        Jason.encode!(%{brewery: result})
      )
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        404,
        Jason.encode!(%{error: "Could not find brewery."})
      )
    end
  end

  # Toggle favorite
  def update(conn, %{"id" => id, "favorite" => f}) do
    case Favorites.get_favorite_by_user_brewery(conn.assigns[:current_user].id, id) do
      nil ->
        Favorites.create_favorite(%{brewery_id: id, active: f, user_id: conn.assigns[:current_user].id})
      favorite -> 
        Favorites.update_favorite(favorite, %{active: f})
    end
    conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        200,
        Jason.encode!(%{})
      )
  end
end