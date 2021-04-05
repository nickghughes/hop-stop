defmodule HopStopWeb.ReviewView do
  use HopStopWeb, :view
  alias HopStopWeb.ReviewView
  alias HopStopWeb.UserView

  def render("index.json", %{reviews: reviews}) do
    %{data: render_many(reviews, ReviewView, "review.json")}
  end

  def render("show.json", %{review: review}) do
    %{data: render_one(review, ReviewView, "review.json")}
  end

  def render("review.json", %{review: review}) do
    user = if Ecto.assoc_loaded?(review.user) do
      render_one(review.user, UserView, "user.json")
    else
      nil
    end

    %{id: review.id,
      brewery_id: review.brewery_id,
      stars: review.stars,
      body: review.body,
      date: HopStop.Reviews.Review.date_display(review),
      user: user}
  end
end
