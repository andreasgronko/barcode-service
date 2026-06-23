const express = require('express');
const bwipjs = require('bwip-js');

const app = express();

const barcodeTypes = {
    'ean13': { bcid: 'ean13', scale: 3, height: 15, includetext: true, textsize: 10 },
    'ean8': { bcid: 'ean8', scale: 3, height: 15, includetext: true, textsize: 10 },
    'upca': { bcid: 'upca', scale: 3, height: 15, includetext: true, textsize: 10 },

    'gs1-128': { bcid: 'gs1-128', scale: 3, height: 18, includetext: true, textsize: 10 },
    'code128': { bcid: 'code128', scale: 3, height: 15, includetext: true, textsize: 10 },
    'code39': { bcid: 'code39', scale: 3, height: 15, includetext: true, textsize: 10 },
    'code93': { bcid: 'code93', scale: 3, height: 15, includetext: true, textsize: 10 },

    'itf14': { bcid: 'itf14', scale: 3, height: 18, includetext: true, textsize: 10 },
    'codabar': { bcid: 'codabar', scale: 3, height: 15, includetext: true, textsize: 10 },
    'msi': { bcid: 'msi', scale: 3, height: 15, includetext: true, textsize: 10 },

    'pdf417': { bcid: 'pdf417', scale: 3, includetext: false },
    'datamatrix': { bcid: 'datamatrix', scale: 4, includetext: false },
    'qrcode': { bcid: 'qrcode', scale: 4, includetext: false },

    'gs1datamatrix': { bcid: 'gs1datamatrix', scale: 4, includetext: false },
    'gs1qrcode': { bcid: 'gs1qrcode', scale: 4, includetext: false }
};

const aliases = {
    'ean-13': 'ean13',
    'gtin13': 'ean13',
    'gtin-13': 'ean13',
    'ean-8': 'ean8',
    'upc-a': 'upca',
    'gs1128': 'gs1-128',
    'ean128': 'gs1-128',
    'ean-128': 'gs1-128',
    'code-128': 'code128',
    'code-39': 'code39',
    'code-93': 'code93',
    'interleaved2of5': 'itf14',
    'itf-14': 'itf14',
    'data-matrix': 'datamatrix',
    'qr': 'qrcode',
    'qr-code': 'qrcode',
    'gs1-datamatrix': 'gs1datamatrix',
    'gs1-qr': 'gs1qrcode',
    'gs1-qrcode': 'gs1qrcode'
};

app.get('/barcode', async (req, res) => {
    try {
        let data = req.query.data;
        let type = req.query.type || 'gs1-128';

        if (!data) {
            return res.status(400).send('Missing data');
        }

        type = type.toLowerCase();
        type = aliases[type] || type;

        if (!barcodeTypes[type]) {
            return res.status(400).send(
                'Invalid type. Use: ' + Object.keys(barcodeTypes).join(', ')
            );
        }

        if (type === 'code39' || type === 'code93') {
            data = data.toUpperCase();
        }

        const options = {
            ...barcodeTypes[type],
            text: data,
            backgroundcolor: 'FFFFFF',
            barcolor: '000000',
            paddingwidth: 0,
            paddingheight: 0
        };

        // Visa text utan Code39/Code93 start- och stopptecken (*)
        if (type === 'code39' || type === 'code93') {
            options.alttext = data;
        }

        const png = await bwipjs.toBuffer(options);

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000'
        });

        res.end(png);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

app.get('/', (req, res) => {
    res.send('Barcode service is running. Use /barcode?type=gs1-128&data=...');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Barcode service running on port ${port}`);
});
