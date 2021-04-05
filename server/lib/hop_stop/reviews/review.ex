defmodule HopStop.Reviews.Review do
  use Ecto.Schema
  import Ecto.Changeset

  schema "reviews" do
    field :body, :string, default: ""
    field :brewery_id, :integer
    field :stars, :integer

    belongs_to :user, HopStop.Users.User

    timestamps()
  end

  @doc false
  def changeset(review, attrs) do
    review
    |> cast(attrs, [:brewery_id, :stars, :body, :user_id])
    |> validate_required([:brewery_id, :stars, :user_id])
  end

  def date_display(review) do
    date = review.inserted_at

    am_pm = if date.hour >= 12 do
      "pm"
    else
      "am"
    end

    hour = cond do
      date.hour > 12 -> date.hour - 12
      date.hour == 0 -> 12
      true -> date.hour
    end

    minute_buffer = if date.minute < 10 do
      "0"
    else
      ""
    end

    "#{date.month}/#{date.day}/#{date.year} #{hour}:#{minute_buffer}#{date.minute} #{am_pm}"
  end
end
