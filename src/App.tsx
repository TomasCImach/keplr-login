import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import logo from "./logo.svg";
import "./App.scss";
import Header from "./header";
import Home from "./pages/home";
import Error from "./pages/error";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Feed from "./pages/feed";
import DetailView from "./pages/feed/DetailView";
import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from "@noahsaso/cosmodal"
import { GasPrice } from "@cosmjs/stargate"

const LOCAL_STORAGE_KEY = "connectedWalletId"

function App() {
  return (
    <WalletManagerProvider
      walletConnectClientMeta={{
        name: "CosmodalExampleDApp",
        description: "A dApp using the @noahsaso/cosmodal library.",
        url: "https://noahsaso-cosmodal.vercel.app",
        icons: ["https://moonphase.is/image.svg"],
      }}
      enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
      renderLoader={() => <p>Loading...</p>}
      localStorageKey={LOCAL_STORAGE_KEY}
      defaultChainId={ChainInfoID.Juno1}
      getSigningCosmWasmClientOptions={(chainInfo) => ({
        gasPrice: GasPrice.fromString("0.0025" + chainInfo.feeCurrencies[0].coinMinimalDenom),
      })}
      getSigningStargateClientOptions={(chainInfo) => ({
        gasPrice: GasPrice.fromString("0.0025" + chainInfo.feeCurrencies[0].coinMinimalDenom),
      })}
    // Choose a different RPC node for the desired chain.
    // chainInfoOverrides={[
    //   {
    //     ...ChainInfoMap[ChainInfoID.Juno1],
    //     rpc: "https://another.rpc.com",
    //   }
    // ]}
    >
      <div className="App">
        <section className="vbox">
          <Header />
          <section>
            <Router>
              <Routes>
                <Route path="/" index element={<Feed />} />
                <Route path="/feed" index element={<Feed />} />
                <Route path="/p/:id" index element={<DetailView />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />

                {/* WILD CARD */}
                <Route path="*" element={<Error />} />
              </Routes>
            </Router>
          </section>
        </section>
      </div>
    </WalletManagerProvider >
  );
}

export default App;
