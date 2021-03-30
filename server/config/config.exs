# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :hop_stop,
  ecto_repos: [HopStop.Repo]

config :hop_stop,
  mix_env: "#{Mix.env()}"

# Configure Guardian for JWTs
config :hop_stop, HopStopWeb.Guardian,
  issuer: "hop_stop",
  secret_key: "LMEjcWw2FmmWSzExjkP9GI7HeF2GSWoCBnpusQqq4/fpRarTcDJEAgdAZ2CS3DOU"

# Configures the endpoint
config :hop_stop, HopStopWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "CJ2uimpsVt7LNagVnXPK0Zr83/XMaqq+fsY/5uhreMuCJ3BYCadbx8q1E2bvn6bp",
  render_errors: [view: HopStopWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: HopStop.PubSub,
  live_view: [signing_salt: "aKuFZj31"]

# Configure CORS (for development)
config :cors_plug,
  origin: ["http://localhost:3000"],
  max_age: 86400,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  headers: ["Authorization", "Content-Type"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
