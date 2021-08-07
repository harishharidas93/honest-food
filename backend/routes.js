const express = require('express');
const router = express.Router();
const turf = require('@turf/turf')
const fs = require('fs'),
  xml2js = require('xml2js');
module.exports = router;

router.post('/get_outlet_identifier', async function (req, res) {
  try {
    const { lat, lng } = req.body
    const customerLocation = turf.point([parseFloat(lng), parseFloat(lat)]);
    const parser = new xml2js.Parser();
    fs.readFile(__dirname + '/FullStackTest_DeliveryAreas.kml', function (err, data) {
      parser.parseString(data, function (err, result) {
        const outletPolygons = result.kml.Document[0].Placemark.filter(x => 'Polygon' in x)
        const validOutlet = outletPolygons.find(outlet => {
          const polygonCordinates = outlet.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0].trim().split('\n').map(x => x.trim().split(',').slice(0, 2).map(x => parseFloat(x)))
          const poly = turf.polygon([polygonCordinates]);
          const isLocationDeliverable = turf.booleanPointInPolygon(customerLocation, poly);
          if (isLocationDeliverable) {
            return true
          }
        });
        if (validOutlet) {
          res.status(200).send({
            status:'found',
            outlet: validOutlet.name[0]
          })
        } else {
          res.status(400).send({
            status:'not_found',
            message: 'No nearby outlet found'
          })
        }
      });
    });
  } catch (err) {
    res.status(400).send(err.message)
  }
})
