import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import carlton from "./fHctp.gif";
import faker from "faker";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import markers from "./markers";

import "./styles.css";

// function getRandomInRange(from, to, fixed) {
//   return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
// }

// const markers = Array(1000)
// .fill(0)
//   .map(() => ({
//     position: [
//       getRandomInRange(28.7433195, 49.3457868, 3),
//       getRandomInRange(-124.7844079, -70.9513812, 3),
//     ],
//   }));

// const center = [41.505, -100.09];

const fakePerson = () => ({
  name: faker.name.firstName() + " " + faker.name.lastName(),
  hireDate: faker.date.recent(1500),
  phone: faker.phone.phoneNumber()
});

const fakePeople = () =>
  Array(faker.random.number(2) + 1)
    .fill(0)
    .map(fakePerson);

function fakePlace() {
  const city = faker.address.city();

  return {
    name: city,
    location: [
      faker.address.streetAddress(),
      faker.address.streetName(),
      city + ",",
      faker.address.state(),
      faker.address.zipCode()
    ].join(" "),
    position: [0, 0],
    safety: {
      preventableAccidents: faker.random.number({ min: 0, max: 1 }),
      dotPreventableAccidents: faker.random.number({ min: 0, max: 1 }),
      injuries: faker.random.number({ min: 0, max: 1 })
    },
    driverUtilization: Math.random(),
    turnover: {
      monthly: Math.random(),
      anualized: Math.random()
    },
    driverCount: {
      ft: faker.random.number({ min: 1, max: 20 }),
      pt: faker.random.number({ min: 0, max: 10 }),
      ic: faker.random.number({ min: 0, max: 10 }),
      term: faker.random.number({ min: 0, max: 10 })
    },
    loadCount: faker.random.number({ min: 10, max: 100 }),
    mpg: faker.random.number({ min: 5, max: 10 }),
    milesPerTruckPerDay: faker.random.number({ min: 250, max: 700 }),
    revenuePerTruckPerDay: faker.random.number({ min: 1000, max: 2000 }),
    callLog: 0,
    tractorEquipment: {
      sleeper: faker.random.number(10),
      daycab: faker.random.number(10),
      straight: faker.random.number(10),
      customer: faker.random.number(10),
      lift: faker.random.number(10),
      yard: faker.random.number(10),
      other: faker.random.number(10)
    },
    accountManagers: fakePeople(),
    operationsManagers: fakePeople()
  };
}

const place = fakePlace();

const places = Array(5000)
  .fill(0)
  .map(fakePlace);

const place2 = {
  name: "Omaha",
  location: "3618-24 D Street Omaha, NE 68107 FM 100513",
  position: [0, 0],
  safety: {
    preventableAccidents: 0,
    dotPreventableAccidents: 0,
    injuries: 0
  },
  driverUtilization: 0.562,
  turnover: {
    monthly: 0,
    anualized: 0.73
  },
  driverCount: {
    ft: 7,
    pt: 0,
    ic: 0,
    term: 0
  },
  loadCount: 17,
  mpg: 7.5,
  milesPerTruckPerDay: 421,
  revenuePerTruckPerDay: 1259,
  callLog: 0,
  tractorEquipment: {
    sleeper: 1,
    daycab: 4,
    straight: 1,
    customer: 0,
    lift: 0,
    yard: 0,
    other: 0
  },
  accountManagers: [
    {
      name: "Drew Hepler",
      hireDate: new Date("1/25/2016")
    }
  ],
  operationsManagers: [
    {
      name: "Jordan Hoover",
      hireDate: new Date("1/25/2016"),
      phone: "3147959607"
    }
  ]
};

class Markers extends React.PureComponent {
  render() {
    return (
      <MarkerClusterGroup>
        {this.props.markers.map((marker, i) => {
          return (
            <Marker
              key={JSON.stringify(marker.position)}
              position={marker.position}
              onClick={this.props.onMarkerClick.bind(null, i)}
            >
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    );
  }
}

class InteractiveMap extends React.Component {
  state = {
    center: [41.505, -100.09],
    zoom: 5,
    height: window.innerHeight,
    currentMarker: null
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = e => {
    this.setState({ height: window.innerHeight });
  };

  handleMarkerClick = i => {
    this.setState({
      currentMarker: i,
      center: markers[i].position
    });
  };

  handleClosePanel = () => {
    this.setState({
      currentMarker: null
    });
  };

  handleViewportChange = ({ center, zoom }) => {
    this.setState({
      center,
      zoom
    });
  };

  render() {
    const place = places[this.state.currentMarker];

    return (
      <div className={`wrapper ${this.state.currentMarker ? "open" : ""}`}>
        <Map
          onClick={this.handleClosePanel}
          onViewportChanged={this.handleViewportChange}
          className="map"
          center={this.state.center}
          zoom={this.state.zoom}
          style={{ height: this.state.height }}
        >
          <TileLayer
            attribution={`© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Markers markers={markers} onMarkerClick={this.handleMarkerClick} />
        </Map>
        <div className="menu">
          <h1>Future Filters</h1>
        </div>
        <div className="infopanel">
          <button className="closebutton" onClick={this.handleClosePanel}>
            <svg
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              viewBox="0 0 24 24"
              enable-background="new 0 0 24 24"
            >
              <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z" />
              <path fill="none" d="M0,0h24v24H0V0z" />
            </svg>
          </button>
          <div className="contents">
            {place && (
              <React.Fragment>
                <h1>{place.name}</h1>
                <div>{place.location}</div>
                <div>
                  <div
                    className={`stat-block ${
                      place.safety.preventableAccidents +
                        place.safety.dotPreventableAccidents +
                        place.safety.injuries >
                      1
                        ? "bad"
                        : "good"
                    }`}
                  >
                    <h2>Safety</h2>
                    <div className="stat-list">
                      <div className="stat">
                        <h3>Preventable Accidents</h3>
                        <div>{place.safety.preventableAccidents}</div>
                      </div>
                      <div className="stat">
                        <h3>DOT Preventable Accidents</h3>
                        <div>{place.safety.dotPreventableAccidents}</div>
                      </div>
                      <div className="stat">
                        <h3>Injuries</h3>
                        <div>{place.safety.injuries}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`stat-block ${
                      place.driverUtilization < 0.5 ? "bad" : "good"
                    }`}
                  >
                    <h2>Driver Utilization</h2>
                    <div className="stat-list">
                      <div className="stat">
                        <b>
                          {place.driverUtilization.toLocaleString(
                            undefined,
                            { style: "percent" }
                          )}
                        </b>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`stat-block ${
                      place.turnover.monthly > 0.5 ||
                      place.turnover.anualized > 0.5
                        ? "bad"
                        : "good"
                    }`}
                  >
                    <h2>Turnover</h2>
                    <div className="stat-list">
                      <div className="stat">
                        <h3>Monthly</h3>
                        <div>
                          {place.turnover.monthly.toLocaleString(
                            undefined,
                            { style: "percent" }
                          )}
                        </div>
                      </div>
                      <div className="stat">
                        <h3>Annualized</h3>
                        <div>
                          {place.turnover.anualized.toLocaleString(
                            undefined,
                            { style: "percent" }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-block">
                    <h2>Driver Count</h2>
                    <div className="stat-list">
                      <div className="stat">
                        <b>
                          {place.driverCount.ft +
                            place.driverCount.ic +
                            place.driverCount.pt +
                            place.driverCount.term}
                        </b>
                      </div>
                      <div className="stat">
                        <h3>FT</h3>
                        <div>{place.driverCount.ft}</div>
                      </div>
                      <div className="stat">
                        <h3>PT</h3>
                        <div>{place.driverCount.pt}</div>
                      </div>
                      <div className="stat">
                        <h3>IC</h3>
                        <div>{place.driverCount.ic}</div>
                      </div>
                      <div className="stat">
                        <h3>Term</h3>
                        <div>{place.driverCount.term}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    loading: true,
    also: false,
    itsFriday: false
  };

  componentDidMount() {
    const date = new Date();

    if (date.getDay() === 5) {
      setTimeout(() => {
        this.setState({
          loading: false
        });
      }, 7000);
      setTimeout(() => {
        this.setState({
          also: true
        });
      }, 2000);
      setTimeout(() => {
        this.setState({
          itsFriday: true
        });
      }, 3500);
    } else {
      setTimeout(() => {
        this.setState({
          loading: false
        });
      }, 1500);
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="loading">
          {(() => {
            if (this.state.also && !this.state.itsFriday) {
              return <div>Oh, and also...</div>;
            } else if (this.state.itsFriday) {
              return (
                <React.Fragment>
                  <img className="carlton" src={carlton} />
                  <div>It's Friday!</div>
                </React.Fragment>
              );
            } else {
              return <div>Loading...</div>;
            }
          })()}
        </div>
      );
    } else {
      return <InteractiveMap />;
    }
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
