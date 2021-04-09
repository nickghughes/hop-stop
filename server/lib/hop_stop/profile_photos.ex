# Credit lecture notes for this file
# https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog/photos.ex
defmodule HopStop.ProfilePhotos do
  def save_photo(name, path) do
    data = File.read!(path)
    hash = sha256(data)
    meta = read_meta(hash)
    save_photo(name, data, hash, meta)
  end

  def save_photo(name, data, hash, nil) do
    File.mkdir_p!(base_path(hash))
    meta = %{
      name: name,
      refs: 0,
    }
    save_photo(name, data, hash, meta)
  end

  #  DATA RACE!?!??!?!
  def save_photo(name, data, hash, meta) do
    meta = Map.update!(meta, :refs, &(&1 + 1))
    File.write!(meta_path(hash), Jason.encode!(meta))
    File.write!(data_path(hash), data)
    {:ok, hash}
  end

  def load_photo(hash) do
    data = File.read!(data_path(hash))
    meta = File.read!(meta_path(hash))
    |> Jason.decode!
    {:ok, Map.get(meta, :name), data}
  end

  # TODO: drop_photo

  def read_meta(hash) do
    with {:ok, data} <- File.read(meta_path(hash)),
         {:ok, meta} <- Jason.decode(data, keys: :atoms)
    do
      meta
    else
      _ -> nil
    end
  end

  def base_path(hash) do
    sys_env = System.get_env("MIX_ENV")
    sys_env = if sys_env, do: sys_env, else: Mix.env
    Path.expand("~/.local/data/hop_stop")
    |> Path.join("#{sys_env}")
    |> Path.join(String.slice(hash, 0, 2))
    |> Path.join(String.slice(hash, 2, 30))
  end

  def meta_path(hash) do
    Path.join(base_path(hash), "meta.json")
  end

  def data_path(hash) do
    Path.join(base_path(hash), "photo.jpg")
  end

  def sha256(data) do
    :crypto.hash(:sha256, data)
    |> Base.encode16(case: :lower)
  end
end