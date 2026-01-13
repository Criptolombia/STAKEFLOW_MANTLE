import { supabase } from "./web3/supabaseClient"

async function test() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")

  console.log("Supabase data:", data)
  console.log("Supabase error:", error)
}

test()
