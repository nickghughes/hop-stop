defmodule HopStop.MeetMeHeres.MeetMeHere do
  use Ecto.Schema
  import Ecto.Changeset

  schema "meetmeheres" do
    field :brewery_id, :integer
    field :dismissed, :boolean, default: false

    belongs_to :user, HopStop.Users.User
    belongs_to :rec, HopStop.Users.User

    timestamps()
  end

  @doc false
  def changeset(meet_me_here, attrs) do
    meet_me_here
    |> cast(attrs, [:brewery_id, :user_id, :rec_id, :dismissed])
    |> validate_required([:brewery_id, :user_id, :rec_id])
  end

  def date_display(meet_me_here) do
    date = meet_me_here.inserted_at

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
