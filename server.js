const express = require('express');
const bwipjs = require('bwip-js');

const app = express();

app.get('/barcode', async (req, res) => {
    try {
        const data = req.query.data;

        if (!data) {
            return res.status(400).send('Missing data');
        }

        const png = await bwipjs.toBuffer({
            bcid: 'gs1-128',
            text: data,
            scale: 3,
            height: 18,
            includetext: true,
            textsize: 10,
            backgroundcolor: 'FFFFFF',
            barcolor: '000000',
            paddingwidth: 2,
            paddingheight: 2,
            monochrome: false
        });

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store'
        });

        res.end(png);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

app.get('/', (req, res) => {
    res.send('Barcode service is running');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Barcode service running on port ${port}`);
});
