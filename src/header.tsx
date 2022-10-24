import { Directus } from "@directus/sdk";
import { MyCollections, Articles, DirectusUsers } from "./helpers/directusType";
import { useCallback, useState, useEffect } from "react"
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager
} from "@noahsaso/cosmodal"

const url = "https://loop-markets.directus.app/"
const directus = new Directus<MyCollections>(url, {
  auth: {
    mode: "json",
    autoRefresh: true,
  },
});

const apiUrl = 'http://localhost:8001/'
// const apiUrl = 'https://juno-signup-api.herokuapp.com/'

export default function Header() {
  const {
    status: walletStatus,
    error,
    name,
    address,
    publicKey,
    signingCosmWasmClient,
    signingStargateClient,
    wallet,
    chainInfo
  } = useWallet()

  // const [authenticated, setAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string>()

  useEffect(() => {
    console.log("address useEffect")
    const fetchUserId = async () => {
      let userId = address ? await userExists(address) : undefined
      console.log("user Id", userId)
      // if (authenticated) {
      try {
        const currentId = (await directus.users.me.read({ fields: ['id'] })).id
        console.log("currentId", currentId)
        if (currentId !== userId || !userId) {
          console.log("logout", currentId, userId)
          await directus.auth.logout()
          window.location.reload();
        }
        // }
        setUserId(userId)
      } catch {

      }
    }
    if (address) {
      fetchUserId().catch(console.error)
    }
  }, [address]);

  async function userExists(address: string): Promise<string | undefined> {
    console.log("userExists before require")
    if (!address || !signingCosmWasmClient) return undefined
    console.log("userExists after require")
    try {
      let response
      await fetch(`${apiUrl}userExists?publicKey=${address}`)
        .then(response => response.json()).then(res => {
          if (res.id) {
            console.log("User exists with ID: ", res.id)
            response = res.id
          } else {
            console.log("User does not exists.")
            response = undefined
          }
        })
      console.log("response", response)
      return response
    } catch (e) {
      console.log("resetPassword Error: ", e)
    }
  }
  return (
    <header className="bg-white header header-md navbar navbar-fixed-top box-shadow min_width center">
      <div className="navbar-header aside-md dk">
        <a href="/" className="navbar-brand">
          {/*<img src="images/logo.png" className="m-r-sm" alt="scale" />*/}
          <span className="hidden-nav-xs">LOOP</span>
        </a>
        <a
          className="btn btn-link visible-xs"
          data-toggle="dropdown"
          data-target=".user"
        >
          <span className="thumb-sm avatar pull-left">
            <img src="https://via.placeholder.com/50" alt="..." />
          </span>
          <b className="caret"></b>
        </a>
      </div>
      <b >-    Wallet: {address ? address.substring(0, 7) + "..." : "no wallet"} UserId: {userId ? userId.substring(0, 4) + "..." : "no userId"}
      </b>
      <ul className="nav navbar-nav navbar-right m-n hidden-xs nav-user user">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">
            <span className="thumb-sm avatar pull-left">
              <img src="https://via.placeholder.com/50" alt="..." />
            </span>
            <b className="caret"></b>
          </a>
          <ul className="dropdown-menu animated fadeInRight">
            <li>
              <a href="/login">Register</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="#">
                <span className="badge bg-danger pull-right">3</span>
                Notifications
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="modal.lockme.html" data-toggle="ajaxModal">
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
}
