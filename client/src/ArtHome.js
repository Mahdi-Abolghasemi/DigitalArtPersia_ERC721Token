import { Component } from "react";
import ERC721_Token from "./contracts/DigitalArtPersia.json";
import getWeb3 from "./getWeb3";
import { History } from "./History";

export class ArtHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      message: "",
      rows: [],
      columns: [],
      user: "",
      tokenIds: [],
      title: [],
      desc: [],
      price: [],
      publishDate: [],
      author: [],
      image: [],
      total: 0,
      contractInstance: "",
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
      total: 0,
    });
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkID = await web3.eth.net.getId();
      const deployedNetwork = await ERC721_Token.networks[networkID];
      const instance = new web3.eth.Contract(
        ERC721_Token.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState(
        { contractInstance: instance, user: accounts, web3: web3 },
        await this.loadDigitalArts()
      );
    } catch (ex) {
      //Catch any errors for any of the above operations.
      alert(
        `Failed to load ArtHome web3, accounts, or contract. Check console for details.`
      );
      console.error(ex);
    }
  };

  async loadDigitalArts() {
    try {
      let ids;
      const result = await this.state.contractInstance.methods
        .findAllPendingArt()
        .call();
      ids = result[0];
      let _total = ids.length;
      if (ids && _total > 0) {
        let row;
        if (_total <= 3) {
          row = 1;
        } else {
          row = Math.ceil(_total / 3);
        }
        let columns = 3;
        this.setState({ rows: [], columns: [] });
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
          _author = [];
        let idx = 0;
        this.resetPendingArts();
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < columns; j++) {
            if (idx < _total) {
              let tokenId = ids[idx];
              const art = await this.state.contractInstance.methods
                .findArt(tokenId)
                .call();
              const priceInEther = this.state.web3.utils.fromWei(
                art[3],
                "ether"
              );
              _tokenIds.push(art[0]);
              _title.push(art[1]);
              _desc.push(art[2]);
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
  async buyArt(tokenId, priceInEther) {
    try {
      const priceInWei = this.state.web3.utils.toWei(priceInEther, "ether");
      await this.state.contractInstance.methods.buyArt(tokenId).send({
        from: this.state.user[0],
        value: priceInWei,
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

  closeModal = () => {
    this.setState({ showHistory: false });
  };

  render() {
    if (this.state.showHistory) {
      return (
        <History
          data={this.state.data}
          closeModalCallBack={this.closeModal}
          source="Home"
        />
      );
    } else {
      if (this.state.hasData) {
        return (
          <div className="App">
            <section className="text-center">
              <h5 className="my-5">Buy/Sell Digital Art on our Art Gallery</h5>
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
                            <div>{this.state.price[i * 3 + j]} (ether)</div>
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
                            <button
                              className="btn btn-secondary btn-md"
                              onClick={(e) => [
                                e.preventDefault(),
                                this.buyArt(
                                  this.state.tokenIds[i * 3 + j],
                                  this.state.price[i * 3 + j]
                                ),
                              ]}
                            >
                              Buy
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      } else {
        return (
          <div className="App">
            <section className="text-center">
              <h5 className="my-5">Buy Digital Art on our Art Gallery</h5>
              <div className="container">
                <div className="alert alert-primary" role="alert">
                  Publish your digital arts in blockchain today!
                </div>
              </div>
            </section>
          </div>
        );
      }
    }
  }
}
