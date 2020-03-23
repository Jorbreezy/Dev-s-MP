import React, { Component } from "react";
import { render } from "react-dom";
const socket = io();

class Marketplace extends Component {
  constructor() {
    super();
    this.state = {
      markets: []
    };
    this.getMarkets = this.getMarkets.bind(this);
    this.addMarket = this.addMarket.bind(this);
    this.makeBid = this.makeBid.bind(this);
    this.getMarkets();
    socket.on("update", rows => {
      this.setState({ markets: rows });
    });
  }
  getMarkets() {
    fetch("/getmarkets")
      .then(res => res.json())
      .then(json => {
        this.setState({ markets: json });
      });
  }
  addMarket() {
    const marketName = document.getElementById("market-to-add").value;
    const description = document.getElementById("job-description").value;
    document.getElementById("market-to-add").value = "";
    document.getElementById("job-description").value = "";
    fetch("/addmarket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        marketName: marketName,
        description: description
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ markets: json });
      });
  }
  makeBid(post_id) {
    const amount = document.getElementById(`${post_id}`);
    const bidAmount = amount.value;
    amount.value = "";
    fetch("/makebid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bidAmount: bidAmount,
        postId: post_id
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({ markets: json });
      });
  }

  render() {
    const marketsToRender = [];
    for (let i = 0; i < this.state.markets.length; i++) {
      // console.log(this.state.markets[i]);
      const post = this.state.markets[i]; //.title;
      marketsToRender.push(
        <div className="market-bid">
          <Market marketInfo={post} />
          <Bids makeBid={this.makeBid} bidInfo={post} />
        </div>
      );
    }
    return (
      <div className="market-container">
        <h1 style={{ textAlign: "center" }}>Marketplace</h1>
        <hr />
        <div className="itemBox">
          <div className="item">
            <span>Job Title: </span>
            <input id="market-to-add"></input>
            <br />
          </div>
          <div className="item">
            <span>Job Description: </span>
            <input id="job-description"></input>
            <br />
          </div>
          <div className="item">
            <button onClick={() => this.addMarket()}>Submit Market</button>
          </div>
        </div>
        <div id="markets">{marketsToRender}</div>
      </div>
    );
  }
}
const Market = props => {
  // console.log(props);
  return (
    <div className={"market-display"}>
      <span>Job Title: </span>
      <span>{props.marketInfo.title}</span>
      <br />
      <span>Job description: </span>
      <span>{props.marketInfo.description}</span>
      <br />
    </div>
  );
};

const Bids = props => {
  // console.log(props);
  // const makeBid = () => {
  //   const amount = document.getElementById(`${props.bidInfo.post_id}`);
  //   console.log(amount.value);
  //   fetch("/makebid",{
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       "bidAmount": amount.value,
  //       "postId": props.bidInfo.post_id
  //     })
  //   })
  //   .then(() => {
  //     amount.value = "";
  //   })
  // }
  const bids = [];
  if (props.bidInfo.bids.length !== 0) {
    props.bidInfo.bids.sort((a, b) => {
      let aAmount = parseFloat(a.amount);
      let bAmount = parseFloat(b.amount);
      if (aAmount < bAmount) return 1;
      else if (aAmount === bAmount) return 0;
      else return -1;
    });
    for (let i = 0; i < props.bidInfo.bids.length; i++) {
      bids.push(
        <li>
          {`${props.bidInfo.bids[i].username} : $${props.bidInfo.bids[i].amount}`}
        </li>
      );
    }
  }

  return (
    <div className="bid-display">
      <div className="bidBox">
        <div className="bidItem">
          <input
            type="number"
            className="bid-input"
            id={props.bidInfo.post_id}
          ></input>
        </div>
        <div className="bidItem">
          <button
            onClick={() => {
              props.makeBid(props.bidInfo.post_id);
            }}
          >
            Submit Bid
          </button>
        </div>
        <br />
        <br />
        <div className="bidItem">
          <span>Bids: </span>
        </div>
      </div>
      <br />
      <ol>{bids}</ol>
    </div>
  );
};
render(<Marketplace />, document.getElementById("root"));
