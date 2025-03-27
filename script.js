async function generateSeedAndCheck() {
  const mnemonic = bip39.generateMnemonic();
  document.getElementById("result").innerHTML = "<b>Seed:</b> " + mnemonic + "<br><br>Checking wallet balances...";

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const address = wallet.address;

  const endpoints = {
    BTC: `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
    ETH: `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`,
    BNB: `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`
  };

  let output = `<b>Seed Phrase:</b><br>${mnemonic}<br><br>`;
  let found = false;

  for (const [coin, url] of Object.entries(endpoints)) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      let balance = 0;
      if (coin === "BTC") balance = data.final_balance / 1e8;
      else if (data.result) balance = data.result / 1e18;

      if (balance > 0) found = true;

      output += `<b>${coin} Address:</b> ${address}<br><b>Balance:</b> ${balance}<br><br>`;
    } catch (err) {
      output += `<b>${coin}:</b> Error fetching balance<br><br>`;
    }
  }

  if (!found) output += "No balance found in any wallet.";
  document.getElementById("result").innerHTML = output;
}

generateSeedAndCheck();
