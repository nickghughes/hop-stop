defmodule HopStopWeb.MeetMeHereController do
  use HopStopWeb, :controller

  alias HopStop.MeetMeHeres
  alias HopStop.MeetMeHeres.MeetMeHere
  alias HopStop.Users

  action_fallback HopStopWeb.FallbackController

  def index(conn, _params) do
    user = Users.get_user_with_meet_me_heres!(conn.assigns[:current_user].id)
    breweries = user.incoming_invites ++ user.outgoing_invites
    |> Enum.map(fn x -> x.brewery_id end)
    |> Enum.uniq
    |> HopStop.BreweryApi.get_ids
    |> Enum.map(fn x -> %{id: x["id"], name: x["name"]} end)

    meetmeheres = %{
      incoming: Enum.reverse(Enum.map(user.incoming_invites, 
        fn x -> 
          %{
            id: x.id, name: x.user.name, email: x.user.email,
            user_id: x.user.id, date: MeetMeHere.date_display(x),
            brewery: Enum.find(breweries, fn y -> y.id == x.brewery_id end)
          }
        end
      )),
      outgoing: Enum.reverse(Enum.map(user.outgoing_invites,
        fn x ->
          %{
            id: x.id, name: x.rec.name, email: x.rec.email,
            user_id: x.rec.id, date: MeetMeHere.date_display(x),
            brewery: Enum.find(breweries, fn y -> y.id == x.brewery_id end)
          }
        end
      )),
    }
    conn
    |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
    |> send_resp(
      200,
      Jason.encode!(meetmeheres)
    )
  end

  def create(conn, %{"brewery_id" => brewery_id, "user_ids" => user_ids}) do
    user_id = conn.assigns[:current_user].id
    brewery_id = if is_bitstring(brewery_id), do: String.to_integer(brewery_id), else: brewery_id
    meet_me_heres = user_ids
    |> Enum.map(fn id -> %{user_id: user_id, rec_id: id, brewery_id: brewery_id, dismissed: false} end)
    MeetMeHeres.bulk_insert(meet_me_heres)
    conn
    |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
    |> send_resp(
      :created,
      Jason.encode!(%{success: "Invitation(s) sent!"})
    )
  end

  # Only called to dismiss
  def update(conn, %{"id" => id}) do
    meet_me_here = MeetMeHeres.get_meet_me_here!(id)

    with {:ok, %MeetMeHere{} = _} <- MeetMeHeres.update_meet_me_here(meet_me_here, %{dismissed: true}) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(200, Jason.encode!(%{}))
    end
  end
end
