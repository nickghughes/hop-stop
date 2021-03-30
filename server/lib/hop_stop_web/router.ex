defmodule HopStopWeb.Router do
  use HopStopWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_auth do
    plug HopStopWeb.Guardian.AuthPipeline
    plug HopStopWeb.Plugs.FetchSession
  end

  scope "/", HopStopWeb do
    pipe_through :browser

    get "/", PageController, :index
  end

  scope "/api/v1", HopStopWeb do
    pipe_through :api

    resources "/users", UserController, only: [:create]
    resources "/session", SessionController, only: [:create]
  end

  scope "/api/v1", HopStopWeb do
    pipe_through [:api, :api_auth]

    resources "/users", UserController, except: [:new, :edit, :create]
    resources "/friends", FriendController, except: [:new, :edit]
    resources "/favorites", FavoriteController, except: [:new, :edit]
    resources "/ratings", RatingController, except: [:new, :edit]
    resources "/comments", CommentController, except: [:new, :edit]
    resources "/meetmeheres", MeetMeHereController, except: [:new, :edit]
  end

  # Other scopes may use custom stacks.
  # scope "/api", HopStopWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: HopStopWeb.Telemetry
    end
  end
end
