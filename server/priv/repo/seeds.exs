# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     HopStop.Repo.insert!(%HopStop.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias HopStop.Repo
alias HopStop.Users.User

defmodule Inject do
  def user(name, email, bio, pass) do
    hash = Argon2.hash_pwd_salt(pass)
    Repo.insert!(%User{email: email, name: name, bio: bio, password_hash: hash})
  end
end

rod = Inject.user("rod", "rod@test.com", "bio", "testrod")