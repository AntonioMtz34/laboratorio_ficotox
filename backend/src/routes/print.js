const express = require('express');
const router = express.Router();
const Dymo = require('dymojs');
const dymoPrinter = new Dymo();
const { DOMParser } = require('xmldom');

// Imprime el texto de una etiqueta
router.post('/print', async (req, res) => {
  const { labelData } = req.body;

  try {
    // Obtén el nombre de la impresora Dymo
    const printersXml = await dymoPrinter.getPrinters();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(printersXml, 'text/xml');
    const printers = xmlDoc.getElementsByTagName('LabelWriterPrinter');

    if (printers.length === 0) {
      console.log('No Dymo printers found');
      return res.status(400).send('No Dymo printers found');
    }

    let printerName;
    for (let i = 0; i < printers.length; i++) {
      const isConnected = printers[i].getElementsByTagName('IsConnected')[0].textContent;
      if (isConnected === 'True') {
        printerName = printers[i].getElementsByTagName('Name')[0].textContent;
        break;
      }
    }

    if (!printerName) {
      console.log('No connected Dymo printers found');
      return res.status(400).send('No connected Dymo printers found');
    }

    console.log('Using printer:', printerName);

    // Imprime la etiqueta
    await dymoPrinter.print(printerName, labelData);
    console.log('Print command sent');

    res.status(200).send('Label printed successfully');
  } catch (error) {
    console.error('Error printing label:', error);
    res.status(500).send(`Error printing label: ${error.message}`);
  }
});

module.exports = router;

