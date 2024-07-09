# Laundry Dash

This application (a Loopie Laundry feature) was built to help users find the best laundry services in their local area. It leverages the React Google Maps library to render results in an intuitive, interactive style. Google Places Autocomplete is imported to handle place lookup. The application consumes Google Places API results to provide local service results, which can then be sorted and filtered by the user. Additionally, OpenAI's chat API is used to suggest laundry services based on the user's needs, while also providing a chat interface for support.

Check it out: https://laundrydash.pages.dev/

![](https://github.com/maahsnd/laundryDash/blob/main/src/assets/demo.gif)

# Built with

* React
* JavaScript
* CSS Modules
* @vis.gl/react-google-maps
* react-select
* Google Places Autocomplete
* MUI
* Vite
* Google Places API
* Open AI API

# Features

* Renders local services as clickable markers on a Google map.
* Displays services in a scrollable list, highlighting map tacks on hover.
* Filters by rating and hours, sorts by rating and distance.
* List sorting and filtering is reflected real time on the map.
* Draggable circle to allow user to alter search radius.
* Geolocation services to provide precise, easily accessed results.
* Chatbot that summarizes results, makes suggestions, and converses about laundry services.
