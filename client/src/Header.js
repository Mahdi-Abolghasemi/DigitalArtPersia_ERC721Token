import { Component } from "react";

export class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="p-2 me-4">
            <a className="navbar-brand" href="/">
              DigitalArtPersiaToken | DPT
            </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item me-4">
                <a className="linkHeader text-white" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item me-4">
                <a className="linkHeader text-white" href="/myWallet">
                  MyWallet
                </a>
              </li>
              <li className="nav-item me-4">
                <a className="linkHeader text-white" href="/publishArt">
                  PublishArt
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
