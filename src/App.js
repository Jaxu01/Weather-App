import React from 'react';

const api = {
  key: "dc862ca896c6425009a609e2e15221cb",
  base: "https://api.openweathermap.org/data/2.5/"
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      weather: {}
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      this.lookUpCity(latitude, longitude);
    });
  }

  async lookUpCity (latitude, longitude) {
    const result = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${api.key}`)
    const resultJSON = await result.json()

    this.setState({query: resultJSON[0].name})
    this.lookUpWeather()
  }

  async lookUpWeather () {
    const query = this.state.query.replace("gmina ", "")
    const result = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    const resultJSON = await result.json()

    this.setState({query: "", weather: resultJSON});
  }

  search (evt) {
    if (evt.key === "Enter") {
      this.lookUpWeather()
    }
  }

  dateBuilder (d) {
    let months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    let days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  render() {
    return (
      <div className={(typeof this.state.weather.main != "undefined")
      ? ((this.state.weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
        <main>
          <div className="search-box">
            <input 
              type="text"
              className="search-bar"
              placeholder='Miasto...'
              onChange={e => this.setState({query:e.target.value})}
              value={this.query}
              onKeyPress={this.search.bind(this)}
            />
          </div>
          {(typeof this.state.weather.main != "undefined") ? (
            <div>
              <div className="location-box">
                <div className="location">{this.state.weather.name}, {this.state.weather.sys.country}</div>
                <div className="date">{this.dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                  {Math.round(this.state.weather.main.temp)}°c
                </div>
                <div className="weather">{this.state.weather.weather[0].main}</div>
              </div>
            </div>
          ) : ''}
        </main>
        <footer>Strona stworzona przez Jakuba Piwtoraka</footer>
      </div>
    );
  }
}

export default App;