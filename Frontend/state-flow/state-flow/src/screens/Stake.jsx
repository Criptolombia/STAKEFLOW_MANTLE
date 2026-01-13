import { motion } from "framer-motion"
import { slide } from "../animations"


function Stake({ setScreen }) {
  return (
    <motion.div
        initial={slide.initial}
        animate={slide.animate}
        exit={slide.exit}
        transition={slide.transition}
    >

      <h2>Create a Flow</h2>

      <p>Amount</p>
      <input placeholder="ETH" />

      <br /><br />

      <button onClick={() => setScreen("DASHBOARD")}>
        Confirm Stake
      </button>

      <br /><br />

      <button onClick={() => setScreen("DASHBOARD")}>
        Cancel
      </button>
    </motion.div>
  )
}

export default Stake
