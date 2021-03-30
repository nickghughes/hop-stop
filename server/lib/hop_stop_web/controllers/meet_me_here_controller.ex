defmodule HopStopWeb.MeetMeHereController do
  use HopStopWeb, :controller

  alias HopStop.MeetMeHeres
  alias HopStop.MeetMeHeres.MeetMeHere

  action_fallback HopStopWeb.FallbackController

  def index(conn, _params) do
    meetmeheres = MeetMeHeres.list_meetmeheres()
    render(conn, "index.json", meetmeheres: meetmeheres)
  end

  def create(conn, %{"meet_me_here" => meet_me_here_params}) do
    with {:ok, %MeetMeHere{} = meet_me_here} <- MeetMeHeres.create_meet_me_here(meet_me_here_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.meet_me_here_path(conn, :show, meet_me_here))
      |> render("show.json", meet_me_here: meet_me_here)
    end
  end

  def show(conn, %{"id" => id}) do
    meet_me_here = MeetMeHeres.get_meet_me_here!(id)
    render(conn, "show.json", meet_me_here: meet_me_here)
  end

  def update(conn, %{"id" => id, "meet_me_here" => meet_me_here_params}) do
    meet_me_here = MeetMeHeres.get_meet_me_here!(id)

    with {:ok, %MeetMeHere{} = meet_me_here} <- MeetMeHeres.update_meet_me_here(meet_me_here, meet_me_here_params) do
      render(conn, "show.json", meet_me_here: meet_me_here)
    end
  end

  def delete(conn, %{"id" => id}) do
    meet_me_here = MeetMeHeres.get_meet_me_here!(id)

    with {:ok, %MeetMeHere{}} <- MeetMeHeres.delete_meet_me_here(meet_me_here) do
      send_resp(conn, :no_content, "")
    end
  end
end
