import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import { useHistory } from "react-router-dom";
import logo from "./logo.png";
import { Table } from "reactstrap";
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

import DappToken from "./contracts/DappToken.json";
import DigitalContentContract from "./contracts/DigitalContentContract.json";
import ContentContractFactory from "./contracts/ContentContractFactory.json";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    _hamletContract: null,
    _hamletToken: null,
    _romeoContract: null,
    _romeoToken: null
  };

  constructor(props) {
    super(props);
    this.handleBuyHamlet = this.handleBuyHamlet.bind(this);
    this.handleGetKeyHamlet = this.handleGetKeyHamlet.bind(this);
    this.handleGetContentHamlet = this.handleGetContentHamlet.bind(this);
    this.handleBuyRomeo = this.handleBuyRomeo.bind(this);
    this.handleGetKeyRomeo = this.handleGetKeyRomeo.bind(this);
    this.handleGetContentRomeo = this.handleGetContentRomeo.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // const [owner, ...otherAccounts] = accounts;

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      // Get the contract instance.

      const _hamletFactory = new web3.eth.Contract(
        ContentContractFactory.abi,
        process.env.REACT_APP_HAMLET_FACTORY
      );
      const _romeoFactory = new web3.eth.Contract(
        ContentContractFactory.abi,
        process.env.REACT_APP_ROMEO_FACTORY
      );

      const _hamletContract = new web3.eth.Contract(
        DigitalContentContract.abi,
        process.env.REACT_APP_HAMLET_CONTRACT
      );
      const _romeoContract = new web3.eth.Contract(
        DigitalContentContract.abi,
        process.env.REACT_APP_ROMEO_CONTRACT
      );

      const _hamletToken = new web3.eth.Contract(
        DappToken.abi,
        process.env.REACT_APP_HAMLET_TOKEN
      );
      const _romeoToken = new web3.eth.Contract(
        DappToken.abi,
        process.env.REACT_APP_ROMEO_TOKEN
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          _hamletContract,
          _hamletToken,
          _romeoContract,
          _romeoToken
        },
        this.loadBooks
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  loadBooks = async () => {
    const {
      web3,
      accounts,
      _hamletContract,
      _hamletToken,
      _romeoContract,
      _romeoToken
    } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    const coinbase = await web3.eth.getCoinbase();

    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
    }

    const publicAddress = coinbase.toLowerCase();

    const hamletName = await _hamletToken.methods.name().call();
    let hamletPrice = await _hamletContract.methods.currentPrice().call();
    // hamletPrice = web3.utils.hexToNumber(hamletPrice);
    const hamletHash = await _hamletContract.methods.dcHash().call();
    hamletPrice = web3.utils.fromWei(hamletPrice, "ether");

    const hamletOwned = await _hamletToken.methods
      .balanceOf(publicAddress)
      .call();

    const romeoName = await _romeoToken.methods.name().call();
    let romeoPrice = await _romeoContract.methods.currentPrice().call();
    // romeoPrice = web3.utils.hexToNumber(romeoPrice);
    romeoPrice = web3.utils.fromWei(romeoPrice, "ether");
    const romeoHash = await _romeoContract.methods.dcHash().call();
    const romeoOwned = await _romeoToken.methods
      .balanceOf(publicAddress)
      .call();
    // Get the value from the contract to prove it worked.

    // Update state with the result.
    this.setState({
      hamletName,
      hamletHash,
      hamletPrice,
      hamletOwned,
      romeoName,
      romeoHash,
      romeoPrice,
      romeoOwned
    });
  };

  async handleBuyHamlet() {
    const { web3, _hamletContract, _hamletToken } = this.state;
    const price = await _hamletContract.methods.currentPrice().call();

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
    }
    const publicAddress = coinbase.toLowerCase();

    await _hamletContract.methods.buy().send({
      value: price,
      from: publicAddress
    });

    const hamletOwned = await _hamletToken.methods
      .balanceOf(publicAddress)
      .call();

    this.setState({ hamletOwned });
  }

  handleGetKeyHamlet = () => {
    let path = `http://localhost:3002/`;
    window.location.href = path;
  };

  handleGetContentHamlet = () => {
    let path = `http://localhost:3000/`;
    window.location.href = path;
  };

  handleBuyRomeo = async () => {
    const { web3, _romeoContract, _romeoToken } = this.state;
    const price = await _romeoContract.methods.currentPrice().call();

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
    }
    const publicAddress = coinbase.toLowerCase();

    await _romeoContract.methods.buy().send({
      value: price,
      from: publicAddress
    });

    const romeoOwned = await _romeoToken.methods
      .balanceOf(publicAddress)
      .call();

    this.setState({ romeoOwned });
  };

  handleGetKeyRomeo = () => {
    let path = `http://localhost:3002/`;
    window.location.href = path;
  };

  handleGetContentRomeo = () => {
    let path = `http://localhost:3000/`;
    window.location.href = path;
    // let history = useHistory();
    // history.push(path);
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to DAMAZON book shop</h1>
        </header>
        <h1>Available products</h1>
        <Table>
          <thead>
            <tr>
              <th className="text-left">Available books</th>
              <th className="text-left">Book hash [SHA-256]</th>
              <th className="text-right">Price [ETH]</th>
              <th className="text-middle">Buy</th>
              <th className="text-middle">Get Key</th>
              <th className="text-middle">Get Book</th>
              <th className="text-middle">Number of owned pieces</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-left">{this.state.hamletName}</th>
              <th className="text-left">{this.state.hamletHash}</th>
              <th className="text-right">{this.state.hamletPrice}</th>
              <th className="text-middle">
                <Button
                  variant="primary"
                  onClick={async () => {
                    await this.handleBuyHamlet();
                  }}
                >
                  Buy
                </Button>
              </th>
              <th className="text-middle">
                <Button variant="Secondary" onClick={this.handleGetKeyHamlet}>
                  Get Key
                </Button>
              </th>
              <th className="text-middle">
                <Button
                  variant="Secondary"
                  onClick={this.handleGetContentHamlet}
                >
                  Get Content
                </Button>
              </th>
              <th className="text-middle">{this.state.hamletOwned}</th>
            </tr>
            <tr>
              <th className="text-left">{this.state.romeoName}</th>
              <th className="text-left">{this.state.romeoHash}</th>
              <th className="text-right">{this.state.romeoPrice}</th>
              <th className="text-middle">
                <Button
                  variant="primary"
                  onClick={async () => {
                    await this.handleBuyRomeo();
                  }}
                >
                  Buy
                </Button>
              </th>
              <th className="text-middle">
                <Button variant="Secondary" onClick={this.handleGetKeyRomeo}>
                  Get Key
                </Button>
              </th>
              <th className="text-middle">
                <Button
                  variant="Secondary"
                  onClick={this.handleGetContentRomeo}
                >
                  Get Content
                </Button>
              </th>
              <th className="text-middle">{this.state.romeoOwned}</th>
            </tr>
          </tbody>
        </Table>
        {/* <div>The stored value is: {this.state.storageValue}</div> */}
      </div>
    );
  }
}

export default App;
