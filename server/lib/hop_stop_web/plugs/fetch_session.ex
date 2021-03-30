defmodule HopStopWeb.Plugs.FetchSession do
  import Plug.Conn

  def init(args), do: args

  def call(conn, _args) do
    token = HopStopWeb.Guardian.Plug.current_token(conn)
    user = case HopStopWeb.Guardian.resource_from_token(token) do
      {:ok, resource, _} -> resource
      {:error, _} -> nil
    end
    assign(conn, :current_user, user)
  end
end