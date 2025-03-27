<script src="https://cdn.jsdelivr.net/npm/bip39@3.0.4/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
<script>
  let scanned = 0;
  const etherscanKey = "RE52UG7173KCEQRZQQ4RBPNNUEVHXA6HJT";
  const bscscanKey = "92BCQ3PBYQ9E5WP6MRZUYMZQJUVU57ZRDB";

  async function checkBalance(seed) {
    const seedBuffer = bip39.mnemonicToSeedSync(seed);
    const hdNode = ethers.utils.HDNode.fromSeed(seedBuffer);

    const btcAddress = hdNode.derivePath("m/44'/0'/0'/0/0").address;
    const ethWallet = new ethers.Wallet(hdNode.derivePath("m/44'/60'/0'/0/0").privateKey);
    const bnbWallet = new ethers.Wallet(hdNode.derivePath("m/44'/60'/0'/0/1").privateKey);
    const ltcAddress = hdNode.derivePath("m/44'/2'/0'/0/0").address;

    const btc = await fetch(`https://api.blockchair.com/bitcoin/dashboards/address/${btcAddress}`).then(r => r.json()).catch(() => null);
    const ltc = await fetch(`https://api.blockchair.com/litecoin/dashboards/address/${ltcAddress}`).then(r => r.json()).catch(() => null);
    const eth = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${ethWallet.address}&apikey=${etherscanKey}`).then(r => r.json()).catch(() => null);
    const bnb = await fetch(`https://api.bscscan.com/api?module=account&action=balance&address=${bnbWallet.address}&apikey=${bscscanKey}`).then(r => r.json()).catch(() => null);

    let hasBalance = false;
    let html = `<div class="box"><div class="seed">Seed: ${seed}</div>`;

    if (btc && btc.data[btcAddress]?.address?.balance > 0) {
      hasBalance = true;
      html += `<div class="balance">BTC: ${btc.data[btcAddress].address.balance / 1e8}</div>`;
    }
    if (ltc && ltc.data[ltcAddress]?.address?.balance > 0) {
      hasBalance = true;
      html += `<div class="balance">LTC: ${ltc.data[ltcAddress].address.balance / 1e8}</div>`;
    }
    if (eth && eth.result && parseInt(eth.result) > 0) {
      hasBalance = true;
      html += `<div class="balance">ETH: ${parseFloat(eth.result) / 1e18}</div>`;
    }
    if (bnb && bnb.result && parseInt(bnb.result) > 0) {
      hasBalance = true;
      html += `<div class="balance">BNB: ${parseFloat(bnb.result) / 1e18}</div>`;
    }

    html += `</div>`;

    scanned++;
    document.getElementById("scanned").innerText = scanned;
    if (hasBalance) {
      document.getElementById("result").innerHTML += html;
    }
  }

  async function startScanner() {
    while (true) {
      const seed = bip39.generateMnemonic(128);
      await checkBalance(seed);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  startScanner();
</script>
    
