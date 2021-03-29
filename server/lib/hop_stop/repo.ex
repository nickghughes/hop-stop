defmodule HopStop.Repo do
  use Ecto.Repo,
    otp_app: :hop_stop,
    adapter: Ecto.Adapters.Postgres
end
