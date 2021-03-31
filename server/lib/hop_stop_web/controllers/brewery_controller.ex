defmodule HopStopWeb.BreweryController do
  use HopStopWeb, :controller

  action_fallback HopStopWeb.FallbackController

  alias HopStop.Search

  # Search

  # First page
  def index(conn, args) do
    results = Search.location_to_breweries(args)
    conn
    |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
    |> send_resp(
      200,
      Jason.encode!(%{data: results})
    )
  end

  # Further pages
  def index(conn, %{"query" => query_str, "page" => page}) do
    results = Search.get_next_page(%{page: page, query: query_str})
    IO.inspect results
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
  # def show(conn, _params) do
  #   conn
  # end
end