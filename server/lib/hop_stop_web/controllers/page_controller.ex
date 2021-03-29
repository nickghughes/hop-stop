defmodule HopStopWeb.PageController do
  use HopStopWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
