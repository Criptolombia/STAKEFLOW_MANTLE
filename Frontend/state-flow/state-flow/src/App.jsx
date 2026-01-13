import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Toaster } from "react-hot-toast"

import TopBar from "./components/TopBar"
import Connect from "./screens/Connect"
import Dashboard from "./screens/Dashboard"
import Stake from "./screens/Stake"
import Marketplace from "./screens/Marketplace" // ✅ IMPORTANTE
import "./testSupabase"

function App() {
  const [screen, setScreen] = useState("HOME")
  const [wallet, setWallet] = useState(null)

  return (
    <>
      {/* 🔔 GLOBAL TOASTER (solo uno en toda la app) */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: "14px"
          }
        }}
      />

      <TopBar
        wallet={wallet}
        setWallet={setWallet}
        setScreen={setScreen}
      />

      <AnimatePresence mode="wait">
        {screen === "HOME" && (
          <Connect
            key="home"
            setScreen={setScreen}
            setWallet={setWallet}
          />
        )}

        {screen === "DASHBOARD" && wallet && (
          <Dashboard
            key="dashboard"
            wallet={wallet}
            setScreen={setScreen}
          />
        )}

        {screen === "STAKE" && wallet && (
          <Stake
            key="stake"
            wallet={wallet}
            setScreen={setScreen}
          />
        )}

        {screen === "MARKETPLACE" && wallet && (
          <Marketplace
            key="marketplace"
            wallet={wallet}
            setScreen={setScreen}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
