
# Experiment Code. Here we are doing backend experiment
# - We want to determine postal code based on lat/lng
# - Then, we want to get breweries based on the code
# - I'm a fan of infinite scroll, so once we run out of options, broaden the search
#   - i.e. start with postal code, then city, then state, then country
defmodule HopStop.BreweryApi do
  def get_brewery(id) do
    headers = api_headers
    resp = HTTPoison.get!(api_url <> "/" <> id, headers)
    result = Jason.decode! resp.body
    result
    |> Map.replace("state", state_abbrevs()[result["state"]])
  end

  def get_ids(ids) do
    id_str = ids
    |> Enum.join(",")
    get_breweries("?by_ids=" <> id_str)
  end

  def by_search_term(query) do
    headers = api_headers
    resp = HTTPoison.get!(api_url() <> "/search?#{URI.encode_query(%{"query" => query})}", headers)
    results = Jason.decode! resp.body
    Enum.map(results, fn x -> Map.replace(x, "state", state_abbrevs()[x["state"]]) end)
  end

  def get_breweries(query_str) do
    headers = api_headers
    resp = HTTPoison.get!(api_url() <> query_str, headers)
    results = Jason.decode! resp.body
    Enum.map(results, fn x -> Map.replace(x, "state", state_abbrevs()[x["state"]]) end)
  end

  # Should be called pseudo-recursively in iex for now
  # Expanding search in this way is susceptible to dupes
  # This should be taken care of on the frontend at the cost of inconsistent page sizes
  def get_breweries_by_location(coords, page, type) do
    page_size = 10
    page = if page, do: String.to_integer(page), else: 1
    query = "?by_dist=#{coords["lat"]},#{coords["lng"]}&per_page=#{page_size}"
    query = if type do
      query <> "&by_type=#{type}"
    else
      query
    end
    results = get_breweries query <> "&page=#{page}"
    %{"results" => results, "coords" => coords, page: page}
  end

  def location_to_breweries(args) do
    coords = if args["coords"], do: Jason.decode!(args["coords"]), else: geocode_location_str(args["locationStr"])
    get_breweries_by_location(coords, args["page"], args["type"])
  end

  defp api_url do
    "https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries"
  end

  defp api_headers do
    [
      "x-rapidapi-key": System.get_env("BREWERY_API_KEY"),
		  "x-rapidapi-host": "brianiswu-open-brewery-db-v1.p.rapidapi.com",
      "useQueryString": true
    ]
  end

  defp geocode_location_str(location_str) do
    resp = HTTPoison.get!(URI.encode("http://www.mapquestapi.com/geocoding/v1/address?key=#{System.get_env("MAPQUEST_API_KEY")}&location=#{location_str}"))
    data = Jason.decode!(resp.body)
    data["results"]
    |> List.first
    |> Map.get("locations")
    |> List.first
    |> Map.get("latLng")
  end

  # Taken from https://stackoverflow.com/questions/11005751/is-there-a-util-to-convert-us-state-name-to-state-code-eg-arizona-to-az/11006236
  # (With some slight edits to convert to elixir)
  # This would be a const somewhere in a non proof-of-concept
  # Lots of these aren't even technically in the US so I will eventually filter them out
  defp state_abbrevs do
    %{}
      |> Map.put("Alabama","AL")
      |> Map.put("Alaska","AK")
      |> Map.put("Alberta","AB")
      |> Map.put("American Samoa","AS")
      |> Map.put("Arizona","AZ")
      |> Map.put("Arkansas","AR")
      |> Map.put("Armed Forces (AE)","AE")
      |> Map.put("Armed Forces Americas","AA")
      |> Map.put("Armed Forces Pacific","AP")
      |> Map.put("British Columbia","BC")
      |> Map.put("California","CA")
      |> Map.put("Colorado","CO")
      |> Map.put("Connecticut","CT")
      |> Map.put("Delaware","DE")
      |> Map.put("District Of Columbia","DC")
      |> Map.put("Florida","FL")
      |> Map.put("Georgia","GA")
      |> Map.put("Guam","GU")
      |> Map.put("Hawaii","HI")
      |> Map.put("Idaho","ID")
      |> Map.put("Illinois","IL")
      |> Map.put("Indiana","IN")
      |> Map.put("Iowa","IA")
      |> Map.put("Kansas","KS")
      |> Map.put("Kentucky","KY")
      |> Map.put("Louisiana","LA")
      |> Map.put("Maine","ME")
      |> Map.put("Manitoba","MB")
      |> Map.put("Maryland","MD")
      |> Map.put("Massachusetts","MA")
      |> Map.put("Michigan","MI")
      |> Map.put("Minnesota","MN")
      |> Map.put("Mississippi","MS")
      |> Map.put("Missouri","MO")
      |> Map.put("Montana","MT")
      |> Map.put("Nebraska","NE")
      |> Map.put("Nevada","NV")
      |> Map.put("New Brunswick","NB")
      |> Map.put("New Hampshire","NH")
      |> Map.put("New Jersey","NJ")
      |> Map.put("New Mexico","NM")
      |> Map.put("New York","NY")
      |> Map.put("Newfoundland","NF")
      |> Map.put("North Carolina","NC")
      |> Map.put("North Dakota","ND")
      |> Map.put("Northwest Territories","NT")
      |> Map.put("Nova Scotia","NS")
      |> Map.put("Nunavut","NU")
      |> Map.put("Ohio","OH")
      |> Map.put("Oklahoma","OK")
      |> Map.put("Ontario","ON")
      |> Map.put("Oregon","OR")
      |> Map.put("Pennsylvania","PA")
      |> Map.put("Prince Edward Island","PE")
      |> Map.put("Puerto Rico","PR")
      |> Map.put("Quebec","QC")
      |> Map.put("Rhode Island","RI")
      |> Map.put("Saskatchewan","SK")
      |> Map.put("South Carolina","SC")
      |> Map.put("South Dakota","SD")
      |> Map.put("Tennessee","TN")
      |> Map.put("Texas","TX")
      |> Map.put("Utah","UT")
      |> Map.put("Vermont","VT")
      |> Map.put("Virgin Islands","VI")
      |> Map.put("Virginia","VA")
      |> Map.put("Washington","WA")
      |> Map.put("West Virginia","WV")
      |> Map.put("Wisconsin","WI")
      |> Map.put("Wyoming","WY")
      |> Map.put("Yukon Territory","YT")
  end
end