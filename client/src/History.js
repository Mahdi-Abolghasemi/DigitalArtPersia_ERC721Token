import { Component } from "react";

export class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.data.length > 0) {
      return (
        <section>
          <table className="table table-sm table-striped table-bordered my-5">
            <thead>
              <tr>
                <th
                  colSpan="9"
                  className="bg-info text-dark text-center h4 p-2"
                >
                  History
                </th>
              </tr>
              <tr>
                <th></th>
                <th>Token Id</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Buyer</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {this.props.data.map((items, i) => (
                <tr>
                  <th>{i + 1}</th>
                  <th>{items[0]}</th>
                  <th>{items[1]}</th>
                  <th>{items[2]}</th>
                  <th>{items[3]}</th>
                  <th>
                    {new Date(items[4] * 1000).toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-secondary"
              onClick={() => this.props.closeModalCallBack()}
            >
              Back To {this.props.source}
            </button>
          </div>
        </section>
      );
    } else {
      return (
        <div className="App text-center">
          <div className="my-5 container alert alert-primary" role="alert">
            The History Is Not For Show
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-secondary"
              onClick={() => this.props.closeModalCallBack()}
            >
              Back To {this.props.source}
            </button>
          </div>
        </div>
      );
    }
  }
}
