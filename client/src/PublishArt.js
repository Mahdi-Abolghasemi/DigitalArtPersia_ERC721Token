import { Component } from "react";
import "./App.css";
import ERC721_Token from "./contracts/DigitalArtPersia.json";
import getWeb3 from "./getWeb3";
import { Navigate } from "react-router-dom";

/**
 * @App Build Decentralized Art Market using ERC-721
 * @Util Publish artwork
 * @Book Learn Ethereum
 * @author brian wu
 */
export class PublishArt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageValue: "images/Kourosh.jpg",
      description: "",
      title: "",
      authorName: "",
      price: 0,
      date: "",
      user: "",
      balance: 0,
      contractInstance: "",
      web3: "",
      finishPage: false,
    };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ERC721_Token.networks[networkId];
      console.log(`acount is: ${accounts[0]}`);
      const balanceInWei = await web3.eth.getBalance(accounts[0]);
      const balance = web3.utils.fromWei(balanceInWei, "ether");
      const instance = new web3.eth.Contract(
        ERC721_Token.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        contractInstance: instance,
        user: accounts,
        balance: balance,
        web3: web3,
      });
    } catch (ex) {
      //Catch any errors for any of the above operations.
      alert(
        `Failed to load PublishArt web3, accounts, or contract. Check console for details.`
      );
      console.error(ex);
    }
  };

  imageChange = (event) => {
    this.setState({ imageValue: event.target.value });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const { imageValue, description, title, authorName, price, date } =
      this.state;
    if (
      this.isNotEmpty(title) &&
      this.isNotEmpty(description) &&
      this.isNotEmpty(authorName) &&
      this.isNotEmpty(date) &&
      this.isNotEmpty(imageValue) &&
      this.isNotEmpty(price)
    ) {
      const priceInWei = this.state.web3.utils.toWei(price, "ether");
      this.publishArt(
        title,
        description,
        date,
        authorName,
        priceInWei,
        imageValue
      );
    }
  };

  isNotEmpty(val) {
    return val && val.length > 0;
  }

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  async publishArt(title, description, date, authorName, price, imageValue) {
    const { user } = this.state;
    try {
      await this.state.contractInstance.methods
        .createTokenAndSellArt(
          title,
          description,
          date,
          authorName,
          price,
          imageValue
        )
        .send({ from: user[0] });
      this.setState({ finishPage: true });
    } catch (e) {
      console.log("Error", e);
    }
  }
  render() {
    if (this.state.finishPage) {
      return <Navigate to="/" />;
    } else {
      return (
        <div>
          <section>
            <div className="row">
              <div className="col-md-2 mb-md-0 mb-5"></div>
              <div className="col-md-8 mb-md-0 mb-5">
                <div className="card publishCard">
                  <div className="card-body">
                    <form className="text-center border border-light p-5">
                      <p className="h4 mb-4">Submit your digital art today.</p>
                      <div className="row">
                        <div className="col-md-6 mb-md-0 mb-5">
                          <input
                            className="form-control mb-4"
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Title"
                            onChange={this.changeHandler}
                            value={this.state.title}
                          />
                          <input
                            className="form-control mb-4"
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Description"
                            onChange={this.changeHandler}
                            value={this.state.description}
                          />
                          <input
                            className="form-control mb-4"
                            id="authorName"
                            name="authorName"
                            type="text"
                            placeholder="Author Name"
                            onChange={this.changeHandler}
                            value={this.state.authorName}
                          />
                        </div>
                        <div className="col-md-6 mb-md-0 mb-5">
                          <input
                            className="form-control mb-4"
                            id="price"
                            name="price"
                            type="text"
                            placeholder="Price (ether)"
                            onChange={this.changeHandler}
                            value={this.state.price}
                          />
                          <input
                            className="form-control mb-4"
                            id="date"
                            name="date"
                            type="text"
                            placeholder="Date"
                            onChange={this.changeHandler}
                            value={this.state.date}
                          />
                          <select
                            className="browser-default custom-select"
                            onChange={this.imageChange}
                            value={this.state.imageValue}
                          >
                            <option value="images/Kourosh.jpg">
                              images/Kourosh.jpg
                            </option>
                            <option value="images/Dariush.jpg">
                              images/Dariush.jpg
                            </option>
                            <option value="images/Xerxes.jpg">
                              images/Xerxes.jpg
                            </option>
                            <option value="images/Persepolis.jpg">
                              images/Persepolis.jpg
                            </option>
                            <option value="images/Gate of All Nations.jpg">
                              images/Gate of All Nations.jpg
                            </option>
                            <option value="images/Soldier-Of-Achaemenid.jpg">
                              images/Soldier-Of-Achaemenid.jpg
                            </option>
                          </select>
                          <figure class="figure">
                            <img
                              className="figure-img img-fluid img-thumbnail rounded"
                              alt="art"
                              src={this.state.imageValue}
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-5 mb-md-0 mb-5"></div>
                        <div className="col-md-2 mb-md-0 mb-5">
                          <button
                            className="btn btn-secondary"
                            type="submit"
                            onClick={this.submitHandler}
                          >
                            Publish
                          </button>
                        </div>
                        <div className="col-md-5 mb-md-0 mb-5"></div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-2 mb-md-0 mb-5"></div>
            </div>
          </section>
        </div>
      );
    }
  }
}
