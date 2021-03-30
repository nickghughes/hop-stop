defmodule HopStopWeb.MeetMeHereControllerTest do
  use HopStopWeb.ConnCase

  alias HopStop.MeetMeHeres
  alias HopStop.MeetMeHeres.MeetMeHere

  @create_attrs %{
    brewery_id: 42
  }
  @update_attrs %{
    brewery_id: 43
  }
  @invalid_attrs %{brewery_id: nil}

  def fixture(:meet_me_here) do
    {:ok, meet_me_here} = MeetMeHeres.create_meet_me_here(@create_attrs)
    meet_me_here
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all meetmeheres", %{conn: conn} do
      conn = get(conn, Routes.meet_me_here_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create meet_me_here" do
    test "renders meet_me_here when data is valid", %{conn: conn} do
      conn = post(conn, Routes.meet_me_here_path(conn, :create), meet_me_here: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.meet_me_here_path(conn, :show, id))

      assert %{
               "id" => id,
               "brewery_id" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.meet_me_here_path(conn, :create), meet_me_here: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update meet_me_here" do
    setup [:create_meet_me_here]

    test "renders meet_me_here when data is valid", %{conn: conn, meet_me_here: %MeetMeHere{id: id} = meet_me_here} do
      conn = put(conn, Routes.meet_me_here_path(conn, :update, meet_me_here), meet_me_here: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.meet_me_here_path(conn, :show, id))

      assert %{
               "id" => id,
               "brewery_id" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, meet_me_here: meet_me_here} do
      conn = put(conn, Routes.meet_me_here_path(conn, :update, meet_me_here), meet_me_here: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete meet_me_here" do
    setup [:create_meet_me_here]

    test "deletes chosen meet_me_here", %{conn: conn, meet_me_here: meet_me_here} do
      conn = delete(conn, Routes.meet_me_here_path(conn, :delete, meet_me_here))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.meet_me_here_path(conn, :show, meet_me_here))
      end
    end
  end

  defp create_meet_me_here(_) do
    meet_me_here = fixture(:meet_me_here)
    %{meet_me_here: meet_me_here}
  end
end
