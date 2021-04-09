defmodule HopStopWeb.ReviewController do
  use HopStopWeb, :controller

  alias HopStop.Reviews
  alias HopStop.Reviews.Review

  action_fallback HopStopWeb.FallbackController

  def index(conn, %{"brewery_id" => brewery_id, "page" => page}) do
    reviews = Reviews.reviews_to_user(conn.assigns[:current_user].id, brewery_id, String.to_integer(page))
    render(conn, "index.json", reviews: reviews)
  end

  def create(conn, %{"brewery_id" => brewery_id, "body" => body, "stars" => stars}) do
    review_params = %{
      brewery_id: brewery_id,
      user_id: conn.assigns[:current_user].id,
      body: body,
      stars: stars
    }
    with {:ok, %Review{} = review} <- Reviews.create_review(review_params) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{review_id: review.id, success: "Review submitted successfully!"})
      )
    end
  end

  def update(conn, %{"id" => id, "review" => review_params}) do
    review = Reviews.get_review!(id)

    with {:ok, %Review{} = review} <- Reviews.update_review(review, review_params) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{success: "Review edited successfully."})
      )
    end
  end

  def delete(conn, %{"id" => id}) do
    review = Reviews.get_review!(id)

    with {:ok, %Review{}} <- Reviews.delete_review(review) do
      send_resp(conn, :no_content, "")
    end
  end
end
