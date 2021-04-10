![](web-ui/src/assets/logo.png)

# Hop Stop - Written Report

### Meta

- *Who was on your team?*

  Nick Hughes

- *What’s the URL of your deployed app?*

  https://hopstop.grumdog.com

- *What’s the URL of your github repository with the code for your
  deployed app?*

  https://github.com/nickghughes/hop-stop.git

- *Is your app deployed and working?*

  Yes, all components are deployed and configured properly.

- *For each team member, what work did that person do on the project?*

  As this project was done solo, I (Nick Hughes) completed it in its
  entirety.

### App

- *What does your project 2 app do?*

  Hop Stop is a brewery search engine and social application, designed
  to inspire users to visit new breweries by themselves and with
  friends. To do so, the app is comprised of a few main components:
  the brewery search page, the dedicated brewery page, the friends
  list, and the "meet me here" (just an invite to a friend to join the
  user at a brewery) list.

  Once the user is logged in, either by signing into an existing
  account or by registering a new one, they are brought to the landing
  page, which includes the brewery search pane. On this page, users
  can search for breweries by either providing a location (either by
  directly allowing the app to access their location or by providing
  an identifying string), searching brewery names, or filtering by
  favorites. Once one or more of these is provided, an infinitely
  scrolling list of brewery results is displayed to the user along
  with a dynamically updating map that adjusts itself as more results
  load.

  The user can click a button on any of the results to visit the
  dedicated page for that brewery, where more details about the
  brewery are shown. There is also a favorite button that the user can
  select and deselect to add/remove that brewery to/from their
  favorites. Under the brewery information is the review section,
  where the user can either add/edit their own review for that brewery
  or browse other users' reviews in an infinitely scrolling list.
  Reviews are comprised of a star rating between 1 and 5 stars and an
  optional comment body. The dedicated brewery page also contains a
  button to create a "meet me here" for that brewery.

  The friends list is represented as a dropdown menu in the top right
  of the screen, along with a profile dropdown and the "meet me here"
  dropdown. The friends list contains a controlled form where the user
  can input the email address of another user to send a friend request
  to, incoming and outgoing requests, and existing friends. The user
  accepts or rejects incoming requests in this dropdown as well. When
  an email is specified to send a friend request to, the user receives
  a message stating that the request was sent, or that there is no
  user associated with that email address. Existing friends have
  corresponding buttons to send "meet me here" requests to them.

  The "meet me here" dropdown resides beside the friends list
  dropdown. It contains a button to begin sending invitations, and
  sections displaying incoming and outgoing invitations. These
  invitations exist until either the sender or receiver dimisses them.
  The "meet me here" creation flow is as follows: first, an
  autocomplete modal appears where the user searches for a brewery to
  choose. Once a brewery is chosen, a multiselect modal appears where
  the user can select any or all of their friends to invite.
  Individual invitations are then sent to each of those users. If the
  flow is started from the brewery page, the autocomplete step is
  skipped. If the flow is started from the friends list, the selected
  friend is selected by default in the multiselect step.

  The profile dropdown also resides with the other dropdowns, and
  contains buttons to either view/edit the user's profile or log out.
  The user profile allows the user to view or edit their email, name,
  an optional profile photo, and/or an optional bio.

- *How has your app concept changed since the proposal?*

  The concept of Hop Stop has remained the same since the proposal,
  with two slight changes: friend requests and "meet me here" requests
  have been separated instead of being polymorphic "notification"
  types, and the `rating` and `comment` tables have been combined into
  `review`. Since friend requests and "meet me heres" were always
  going to exist in separate dropdowns anyway, it ended up being more
  concise to fit the respective notifications in those dropdowns
  instead of creating a third confusing one. At the same time, this
  slightly facilitated development by avoiding a complex design
  pattern. Also, ratings and comments were combined into reviews for a
  similar reason: the dedicated brewery pages become more concise and
  easier to develop without losing any functionality. The consolidated
  review pattern also more closely matches similar applications, such
  as Google Maps.

- *How do users interact with your application? What can they
  accomplish by doing so?*

  When the user searches for breweries on the search page,
  particularly when searching using their own location, they can find
  new breweries to visit that they may not have heard of before. By
  viewing other users' reviews for these breweries, they can choose
  where they might want to try next either with friends or by
  themselves. For example, I go to breweries often, but using Hop Stop
  allowed me to quickly find a few breweries I had never heard of
  before that are in walking distance from Boston.

  By favoriting breweries, users can keep track of which places they
  enjoyed most. While filtering breweries by favorite does not
  facilitate finding new breweries, it does allow easier access for
  inviting friends using the "meet me here" feature, as well as
  managing and browsing reviews.

  By creating and browsing reviews, users can share their thoughts on
  different breweries for other users to read, as well as digest the
  opinions of others to make educated decisions about where to drink
  next.

  The main purpose of adding friends on Hop Stop is to enable "meet me
  here" invitations. By sending and receiving these, users are able to
  easily communicate that they are at or will be at a certain brewery.
  Making these invitations dismissable makes it easy for the sender to
  signal that they have left the brewery, or for the receiver to
  acknowledge that it has been read. Incoming "meet me here"
  invitations also include links to the dedicated brewery pages, so
  receiver has an easier time finding information about the brewery
  and how to get there.

- *For each project requirement above, how does your app meet that
  requirement?*

  Hop Stop is comprised of a React SPA and JSON API built with Phoenix
  and Ecto. Beckend endpoints excluding login and register are
  authenticated using JWTs, managed by the `mix` dependency
  `guardian`. Considering the larger number of necessary database
  tables and relations, as well as the inclusion of external APIs and
  complex algorithms such as infinite scroll, this project is far more
  ambitious than the projects that have been completed in the past
  (Bulls and Cows/Events). It is deployed successfully using HTTPS to
  hopstop.grumdog.com.

  Database tables for Hop Stop include `user`, `friend`, `favorite`,
  `review`, and `meet_me_here`, with each of their use cases outlined
  above. User passwords are stored and authenticated locally and
  securely using `Argon2` similarly to how we discussed in class.

  To query for breweries, Hop Stop's backend makes requests to the
  **Open Brewery DB** public API, which requires a valid API key to
  use. **Open Brewery DB** exposes multiple endpoints for getting and
  searching for breweries, with a number of possible query options to
  use.

  Users' friends lists and "meet me here" lists are updated in
  real-time using Phoenix channels, which are broadcast to on relevant
  controller actions. When the user logs in (or enters the site while
  already logged in), they join a channel denoted by user id, and all
  of these real-time updates are pushed to that channel. For example,
  when a user sends a friend request to another user, that request
  will instantly appear in the receiver's friends dropdown. The same
  behavior exists for responding to friend requests and sending "meet
  me here" requests.

  The "neat" features of Hop Stop include various location- and
  map-based behaviors. On the frontend, the JS location API is used to
  acquire user locations (if they choose to search for breweries that
  way). If they instead choose to provide a string denoting location
  (i.e. "Boston"), the backend uses MapQuest's geocoding API (which
  also requires a valid API key) to convert the string to coordinates.
  In either case, nearby breweries are queried for using the resulting
  coordinates. Once the frontend receives results, the JS Google Maps
  API (also requiring an API key) is used to display a map with
  markers denoting the user's current location (if provided) and each
  of the brewery results that have been found. As more pages load, the
  map pans and zooms to fit all of the results.

  Testing Hop Stop was nearly exclusively done using extensive manual
  testing, since there are no automated unit tests. The two specific
  components that required the most manual testing were the automatic
  map zooming and panning on pagination and real-time updates to
  friends and "meet me here" lists using Phoenix channels. For the
  automatic map fitting, the test was conducted by logging all of the
  relevant parameters (average latitude and longitude of all results,
  and the height and width of the map element itself) and scrolling
  through search results. Adjustments were made between each iteration
  (usually to the method used to find the height of the map element,
  which ended up being a `useRef` implementation). Real-time updates
  were tested by creating two separate accounts and sending/responding
  to requests on each. The process was as follows: sign in as one user
  in Chrome, then open an incognito tab to sign in as the other. With
  these windows side by side, send a friend request from one user to
  the other and see the request appear in the friends list. The same
  was done for responding to that request, and sending "meet me here"
  requests between those users.

- *What interesting stuff does your app include beyond the project
  requirements?*

  Most of the interesting components that could have sufficed as
  "neat" are included in the location flow described above. If using
  location API counts as the "neat" feature, for example, then the
  Google Maps implementation and MapQuest geocoding are definitely
  additional "interesting stuff."

- *What’s the complex part of your app? How did you design that
  component and why?*

  The most complex component of Hop Stop is the brewery search
  component, which is comprised of the multiple filter options, the
  infinitely scrolling list, and the map of results. Each of these
  components required individual complex designs.

  For filtering, I first had to identify the types of queries that
  could be made to **Open Brewery DB**, and how they could be
  combined. Since search terms, coordinates, and individual ids can be
  provided, these were the types of filters included (ids found
  through the favorites filter). A single redux state `filters`
  contains the currently selected values for each filter type, and the
  entire object is converted to a valid query string to send to the
  backend API (along with the current page). Allowing both the
  location API and manual location entry was a decision that was made
  so that all users could find breweries, regardless of whether or not
  they can or want to share their location, and can also find
  breweries at future travel locations, for example.

  For the infinite scroll, I used a static page size of 10 (denoted in
  the backend controller for searching) and a pattern involving
  sending the current page back and forth between the frontend and
  backend. **Open Brewery DB** includes query options for both page
  number and page size, so the results can be offset correctly when
  acquired as long as the rest of the query remains the same. For the
  first page, only the filters are sent by the frontend and the
  controller action defaults the current page to 0. Results are
  returned to the user along with both the page number that was just
  loaded and the coordinates used to query (so geocoding does not need
  to be done multiple times). Subsequent calls increment the returned
  page number, leaving the rest of the query string the same. The only
  other addition is the coordinates if the original query included a
  location string. 

  The implementation for the map (auto panning and zooming) is
  described in the previous section.

- *What was the most significant challenge you encountered and how did
  you solve it?*

  The most significant challenge that was faced in the development of
  Hop Stop was the subpar query options exposed by **Open Brewery
  DB**. For example, there was no option for coordinates to be
  provided to query for nearby breweries, even though each brewery
  entry had coordinates as fields. The original implementation for the
  infinite scroll (which was one of my proposal experiments) was a
  dynamically expanding location query by postal code, city, and
  state, where whenever no more results were found the most specific
  query parameter was removed. This method was functional, but nearby
  breweries were quickly mixed with ones that were across the state or
  country. Additionally, there was no query option for multiple ids,
  so querying by favorites would have required a separate query for
  each id.

  To circumvent these issues, I was able to contact the developer of
  **Open Brewery DB** through the API's public Discord server. While
  he told me he did not have the time to figure out how to develop a
  "nearest-first" sort query option for the API, he did provide the
  link to the open source codebase, which is written in Rails
  (https://github.com/chrisjm/openbrewerydb-rails-api). Since I have
  some experience with Rails from co-op, I was able to figure out how
  to implement that query option (as well as the array of ids query
  option) and create a pull request, that was ultimately merged in and
  deployed. After that, the infinite scroll worked flawlessly.