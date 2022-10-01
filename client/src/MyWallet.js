import { Component } from "react";
import "./App.css";
import ERC721_Token from "./contracts/DigitalArtPersia.json";
import getWeb3 from "./getWeb3";
import Modal from "react-bootstrap/Modal";
import { History } from "./History";

/**
 * @App Build Decentralized Art Market using ERC-721
 * @Util my digial art wallet
 * @Book Learn Ethereum
 * @author brian wu
 */
export class MyWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      message: "",
      rows: [],
      columns: [],
      tokenIds: [],
      title: [],
      desc: [],
      price: [],
      publishDate: [],
      author: [],
      image: [],
      status: [],
      total: 0,
      user: "",
      balance: 0,
      contractInstance: "",
      sellTokenId: "",
      sellPrice: 0,
      showModal: false,
      web3: "",
      showHistory: false,
      data: [],
    };
  }

  resetPendingArts() {
    this.setState({
      tokenIds: [],
      title: [],
      desc: [],
      price: [],
      publishDate: [],
      author: [],
      image: [],
      status: [],
      total: 0,
    });
  }
  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkID = await web3.eth.net.getId();
      const deployedNetwork = ERC721_Token.networks[networkID];
      const instance = new web3.eth.Contract(
        ERC721_Token.abi,
        deployedNetwork && deployedNetwork.address
      );

      const balanceInWei = await web3.eth.getBalance(accounts[0]);
      const balance = web3.utils.fromWei(balanceInWei, "ether");

      this.setState(
        {
          user: accounts,
          balance: balance,
          contractInstance: instance,
          web3: web3,
        },
        await this.loadMyDigitalArts(web3)
      );
    } catch (ex) {
      //Catch any errors for any of the above operations.
      alert(
        `Failed to load MyWallet web3, accounts, or contract. Check console for details.`
      );
      console.error(ex);
    }
  };

  async loadMyDigitalArts(web3) {
    try {
      const result = await this.state.contractInstance.methods
        .findMyArts()
        .call({ from: this.state.user[0] });
      let _total = result.length;
      if (_total > 0) {
        let row;
        if (_total <= 3) {
          row = 1;
        } else {
          row = Math.ceil(_total / 3);
        }
        let columns = 3;
        let rowArr = Array.apply(null, { length: row }).map(
          Number.call,
          Number
        );
        let colArr = Array.apply(null, { length: columns }).map(
          Number.call,
          Number
        );

        this.setState({ rows: rowArr, columns: colArr });
        let _tokenIds = [],
          _title = [],
          _desc = [],
          _price = [],
          _publishDate = [],
          _image = [],
          _author = [],
          _status = [];
        let idx = 0;
        this.resetPendingArts();
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < columns; j++) {
            if (idx < _total) {
              let tokenId = result[idx];
              const art = await this.state.contractInstance.methods
                .findArt(tokenId)
                .call();
              const priceInEther = web3.utils.fromWei(art[3], "ether");
              _tokenIds.push(art[0]);
              _title.push(art[1]);
              _desc.push(art[2]);
              if (art[4] === 1) {
                _status.push("In selling");
              } else {
                _status.push("Publish");
              }

              _price.push(priceInEther);
              _publishDate.push(art[5]);
              _image.push(art[9]);
              _author.push(art[6]);
            }
            idx++;
          }
        }

        this.setState({
          tokenIds: _tokenIds,
          title: _title,
          desc: _desc,
          price: _price,
          publishDate: _publishDate,
          author: _author,
          status: _status,
          image: _image,
          total: _total,
        });
        this.setState({ hasData: true });
      } else {
        this.setState({ hasData: false });
      }
    } catch (e) {
      console.log("Error", e);
    }
  }

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  sellArt(tokenId) {
    try {
      //open  popup window
      this.setState({ sellTokenId: tokenId, showModal: true });
    } catch (e) {
      console.log("Error", e);
    }
  }

  async submitArtSell() {
    try {
      const priceInWei = this.state.web3.utils.toWei(
        this.state.sellPrice,
        "ether"
      );
      await this.state.contractInstance.methods
        .resellArt(this.state.sellTokenId, priceInWei)
        .send({
          from: this.state.user[0],
        });
      window.location.reload();
    } catch (e) {
      console.log("Error", e);
    }
  }

  showHistory = async (tokenId) => {
    const result = await this.state.contractInstance.methods
      .getArtAllTxn(tokenId)
      .call();

    let table = [[], []];
    const size = result[0].length;

    if (size > 0) {
      const ids = result[0];
      const prices = result[1];
      const sellers = result[2];
      const buyers = result[3];
      const txnDates = result[4];

      for (let i = 0; i < size; i++) {
        table[i][0] = ids[i];
        table[i][1] = prices[i];
        table[i][2] = sellers[i];
        table[i][3] = buyers[i];
        table[i][4] = txnDates[i];
      }

      this.setState({
        showHistory: true,
        data: table,
      });
    } else {
      this.setState({
        showHistory: true,
        data: [],
      });
    }
  };

  closeHistory = () => {
    this.setState({ showHistory: false });
  };

  render() {
    if (this.state.showHistory) {
      return (
        <History
          data={this.state.data}
          closeModalCallBack={this.closeHistory}
          source="My Wallet"
        />
      );
    } else {
      if (this.state.hasData) {
        return (
          <div className="App">
            <section className="text-center">
              <div className="row mb-3 mt-3">
                <div className="col-md-2 mb-md-0 mb-1"></div>
                <div className="col-md-8 mb-md-0 mb-1">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-md-0">
                          <span>My Address:</span> {this.state.user[0]}
                        </div>
                        <div className="col-md-6 mb-md-0">
                          <span>Balance:</span> {this.state.balance} (ether)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-md-0 mb-1"></div>
              </div>
              <h5 className="text-center my-3">My Wallet Arts</h5>
              <div className="container">
                {this.state.rows.map((row, i) => (
                  <div className="row" key={i}>
                    {this.state.columns.map((col, j) => (
                      <div className="col-lg-4 col-md-12 mb-lg-4 mb-0" key={j}>
                        {i * 3 + j < this.state.total && (
                          <div>
                            <div>
                              <img
                                className="img-fluid rounded mb-2"
                                src={this.state.image[i * 3 + j]}
                                alt="art"
                              />
                            </div>
                            <div>TokenId: {this.state.tokenIds[i * 3 + j]}</div>
                            <h5>Title: {this.state.title[i * 3 + j]}</h5>
                            <div className="dark-grey-text">
                              {this.state.price[i * 3 + j]} (ether)
                            </div>
                            <p>
                              by{" "}
                              <span className="fw-bold">
                                {this.state.author[i * 3 + j]}
                              </span>
                              , {this.state.publishDate[i * 3 + j]}
                            </p>
                            <p>
                              <a
                                href="#"
                                onClick={(e) => [
                                  e.preventDefault(),
                                  this.showHistory(
                                    this.state.tokenIds[i * 3 + j]
                                  ),
                                ]}
                              >
                                History
                              </a>
                            </p>
                            <p className="alert alert-primary">
                              {this.state.desc[i * 3 + j]}
                            </p>
                            {this.state.status[i * 3 + j] === "Publish" && (
                              <button
                                className="btn btn-secondary btn-md"
                                onClick={(e) => [
                                  e.preventDefault(),
                                  this.sellArt(this.state.tokenIds[i * 3 + j]),
                                ]}
                              >
                                {this.state.status[i * 3 + j]}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Modal show={this.state.showModal}>
                <Modal.Header>
                  <h5>Sell Art</h5>
                  <button
                    type="button"
                    className="btn btn-danger close"
                    onClick={this.closeModal}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </Modal.Header>
                <Modal.Body>
                  <input
                    className="form-control mb-4"
                    id="sellPrice"
                    name="sellPrice"
                    type="text"
                    placeholder="Price (ether)"
                    onChange={this.changeHandler}
                    value={this.state.sellPrice}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => [e.preventDefault(), this.submitArtSell()]}
                  >
                    Submit
                  </button>
                </Modal.Footer>
              </Modal>
            </section>
          </div>
        );
      } else {
        return (
          <div className="App">
            <section className="text-center">
              <div className="row mb-3 mt-3">
                <div className="col-md-2 mb-md-0 mb-1"></div>
                <div className="col-md-8 mb-md-0 mb-1">
                  <div className="card">
                    <div className="card-body ">
                      <div className="row">
                        <div className="col-md-6 mb-md-0">
                          <span className="font-weight-bold blue-grey-text">
                            My Address:
                          </span>{" "}
                          {this.state.user[0]}
                        </div>
                        <div className="col-md-6 mb-md-0">
                          <span className="font-weight-bold blue-grey-text">
                            Balance:
                          </span>{" "}
                          {this.state.balance} (ether)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-md-0 mb-1"></div>
              </div>
            </section>
          </div>
        );
      }
    }
  }
}
