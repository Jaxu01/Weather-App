import React from 'react';
import Weatherbox from './Weatherbox.js';


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

  search (evt) {
    if (evt.key === "Enter") {
      this.lookUpWeather()
    }
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
            <Weatherbox weather={this.state.weather} />
          ) : ''}
        </main>
        <footer>Strona stworzona przez Jakuba Piwtoraka</footer>
      </div>
    );
  }
}

export default App;
