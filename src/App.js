import {Fragment, useEffect, useState} from "react";
import './App.css';

/*
 * Modified from
 * https://stackoverflow.com/a/32638472/7984867
 */
function parseNum(num, fixed=2) {
  fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
  const b = (num).toPrecision(2).split("e"); // get power
  const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
  const c = k < 1 ? num.toFixed(fixed) : (num / Math.pow(10, k * 3) ).toFixed(fixed); // divide by power
  const e = c + ['', ' K', ' M', ' B', ' T'][k]; // append power

  return e;
}

function formatText(text, format) {
  if (format) {
    if (format === 'cap') return text.toUpperCase();
    else {
      const num = parseFloat(text);
      if (isNaN(num)) return text;

      if (format === 'num') return parseNum(num);
      else if (format === 'per') return num.toFixed(2) + '%';
    }
  }

  return text;
}

function Text(props) {
  const COLORS = {
    'black': '#1E1E1E',
    'dark': 'rgba(30, 30, 30, 0.65)',
    'grey': 'rgba(30, 30, 30, 0.35)',
    'green': '#61BF1E',
    'red': '#FF492D',
  }
  const {text, color, format} = props;

  return (
    <div
      className="text"
      style={{
        color: COLORS[color],
      }}
    >
      {formatText(text, format)}
    </div>
  )
}

function App() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h%2C7d")
      .then(response => response.json())
      .then((data) => {
        setData(data);
      })
  },[])

  return (
    <div className="App">
      <div className="background">
        <div className="title">
          <Text text="Watchlist"/>
        </div>
        <div className="table">
          <div
            style={{
              marginLeft: "2px"
            }}
          >
            <Text
              text="Currency"
              color="grey"
            />
          </div>
          <Text
            text="Last"
            color="grey"
          />
          <Text
            text="24h%"
            color="grey"
          />
          <Text
            text="7d%"
            color="grey"
          />
          <Text
            text="Mrkt Cap"
            color="grey"
          />
          {!data ? null : data.map((item, index) => (
            <Fragment
              key={index}
            >
              <div
                className="cell"
                style={index === 0 ? {
                  paddingTop: "8px",
                } : (index === data.length - 1 ? {
                  paddingBottom: "8px",
                } : undefined)}
              >
                <img src={item['image']} className="icon" alt="icon"/>
                <Text
                  text={item['symbol']}
                  color="black"
                  format="cap"
                />
              </div>
              <div
                className="cell"
                style={index === 0 ? {
                  paddingTop: "8px",
                } : (index === data.length - 1 ? {
                  paddingBottom: "8px",
                  borderBottom: "0px"
                } : undefined)}
              >
                <Text
                  text={item['current_price']}
                  color="dark"
                  format="num"
                />
              </div>
              <div
                className="cell"
                style={index === 0 ? {
                  paddingTop: "8px",
                } : (index === data.length - 1 ? {
                  paddingBottom: "8px",
                  borderBottom: "0px"
                } : undefined)}
              >
                <Text
                  text={item['price_change_percentage_24h_in_currency']}
                  color={item['price_change_percentage_24h_in_currency'] > 0 ? 'green' : 'red'}
                  format="per"
                />
              </div>
              <div
                className="cell"
                style={index === 0 ? {
                  paddingTop: "8px",
                } : (index === data.length - 1 ? {
                  paddingBottom: "8px",
                  borderBottom: "0px"
                } : undefined)}
              >
                <Text
                  text={item['price_change_percentage_7d_in_currency']}
                  color="dark"
                  format="per"
                />
              </div>
              <div
                className="cell"
                style={index === 0 ? {
                  paddingTop: "8px",
                } : (index === data.length - 1 ? {
                  paddingBottom: "8px",
                  borderBottom: "0px"
                } : undefined)}
              >
                <Text
                  text={item['market_cap']}
                  color="dark"
                  format="num"
                />
              </div>

              {index === data.length - 1 ? null : <div className="divider"/>}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
