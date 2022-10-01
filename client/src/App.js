import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArtHome } from "./ArtHome";
import { PublishArt } from "./PublishArt";
import { MyWallet } from "./MyWallet";
import { Header } from "./Header";

function App() {
  return (
    <section>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ArtHome />} />
          <Route path="/publishArt" element={<PublishArt />} />
          <Route path="/myWallet" element={<MyWallet />} />
        </Routes>
      </BrowserRouter>
    </section>
  );
}

export default App;
