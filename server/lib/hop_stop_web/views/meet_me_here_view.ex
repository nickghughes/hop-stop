defmodule HopStopWeb.MeetMeHereView do
  use HopStopWeb, :view
  alias HopStopWeb.MeetMeHereView

  def render("index.json", %{meetmeheres: meetmeheres}) do
    %{data: render_many(meetmeheres, MeetMeHereView, "meet_me_here.json")}
  end

  def render("show.json", %{meet_me_here: meet_me_here}) do
    %{data: render_one(meet_me_here, MeetMeHereView, "meet_me_here.json")}
  end

  def render("meet_me_here.json", %{meet_me_here: meet_me_here}) do
    %{id: meet_me_here.id,
      brewery_id: meet_me_here.brewery_id}
  end
end
