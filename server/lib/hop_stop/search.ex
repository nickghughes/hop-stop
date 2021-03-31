
# Experiment Code. Here we are doing backend experiment
# - We want to determine postal code based on lat/lng
# - Then, we want to get breweries based on the code
# - I'm a fan of infinite scroll, so once we run out of options, broaden the search
#   - i.e. start with postal code, then city, then state, then country
defmodule HopStop.Search do
  def get_breweries(query_str) do
    headers = [
      "x-rapidapi-key": System.get_env("BREWERY_API_KEY"),
		  "x-rapidapi-host": "brianiswu-open-brewery-db-v1.p.rapidapi.com"
    ]
    resp = HTTPoison.get!("https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries" <> query_str, headers, [{:timeout, :infinity}, {:recv_timeout, :infinity}])
    results = Jason.decode! resp.body
    Enum.map(results, fn x -> Map.replace(x, "state", state_abbrevs()[x["state"]]) end)
  end

  # Should be called pseudo-recursively in iex for now
  # Expanding search in this way is susceptible to dupes
  # This should be taken care of on the frontend at the cost of inconsistent page sizes
  def get_breweries_by_location(location, query_str \\ nil, page \\ 1, results \\ []) do
    page_size = 10
    query = query_str || "?by_postal=#{location["postal"]}&by_city=#{location["city"]}&by_state=#{location["state"]}"
    full_query = if String.length(query) > 1 do
      query <> "&per_page=#{page_size}&page=#{page}"
    else
      query <> "per_page=#{page_size}&page=#{page}"
    end
    IO.inspect full_query

    results = results ++ get_breweries full_query

    [_ | broadened_query_terms] = String.split(query, "&")
    broadened_query = "?" <> Enum.join(broadened_query_terms, "&")

    cond do
      length(results) < page_size and String.length(query) > 0 -> 
        get_breweries_by_location(location, broadened_query, 1, results)
      true -> %{"page" => page, "query" => query, "results" => results}
    end
  end

  def get_next_page(prev_result_hash) do
    get_breweries_by_location(nil, prev_result_hash.query, String.to_integer(prev_result_hash.page)+1)
  end

  def lat_lng_to_location_hierarchy(latitude, longitude) do
    resp = HTTPoison.get!("http://www.mapquestapi.com/geocoding/v1/reverse?key=#{System.get_env("MAPQUEST_API_KEY")}&location=#{latitude},#{longitude}")
    data = Jason.decode!(resp.body)
    location = data["results"]
    |> List.first
    |> Map.get("locations")
    |> List.first
    %{
      "postal" => List.first(String.split(location["postalCode"], "-")), 
      "city" => location["adminArea5"], 
      "state" => state_names()[location["adminArea3"]]
    }
  end

  def location_to_breweries(%{"lat" => latitude, "lng" => longitude}) do
    location = lat_lng_to_location_hierarchy(latitude, longitude)
    get_breweries_by_location(location)
  end

  def location_to_breweries(args) do
    args = if args["by_state"] do
      Map.replace(args, "by_state", state_names()[args["by_state"]] || args["by_state"])
    else
      args
    end

    query_args = args
    |> Map.to_list
    |> Enum.map(fn {key, val} -> "#{key}=#{val}" end)
    |> Enum.join("&")
    IO.inspect "?" <> query_args
    get_breweries_by_location(nil, "?" <> query_args)
  end

  # Taken from https://stackoverflow.com/questions/11005751/is-there-a-util-to-convert-us-state-name-to-state-code-eg-arizona-to-az/11006236
  # (With some slight edits to convert to elixir)
  # This would be a const somewhere in a non proof-of-concept
  # Lots of these aren't even technically in the US so I will eventually filter them out
  def state_abbrevs do
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

  def state_names do
    state_abbrevs
    |> Map.new(fn {key, val} -> {val, key} end)
  end

end