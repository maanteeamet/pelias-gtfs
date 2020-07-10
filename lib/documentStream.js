var through = require( 'through2' );
var peliasModel = require( 'pelias-model' );
var logger = require( 'pelias-logger' ).get( 'pelias-GTFS' );

function mapVehicleType(type) {
  switch(type) {
  case '0':
    return 'tram stop';
  case '1':
    return 'subway station';
  case '3':
    return 'bus stop';
  case '4':
    return 'ferry pier';
  case '109':
    return 'train stop';
  }

  return null;
}

function mapLocality(authority) {
  switch (authority) {
    case 'Maanteeamet':
      return '';
    case 'Saare MV':
      return 'Saaremaa';
    case 'Lääne-Viru MV':
      return 'Lääne-Virumaa';
    case 'Pärnu LV':
      return 'Pärnu linn';
    case 'Tartu LV':
      return 'Tartu linn';
    case 'Rapla LV':
      return 'Raplamaa';
    case 'Võru MV':
      return 'Võrumaa';
    case 'Valga MV':
      return 'Valgamaa';
    case 'Järvamaa ÜTK':
      return 'Järvamaa';
    case 'Lääne MV':
      return 'Läänemaa';
    case 'Ida-Viru MV':
      return 'Ida-Virumaa';
    case 'Tallinna TA':
      return 'Tallinna linn';
    case 'Viljandi MV':
      return 'Viljandimaa';
    case 'Kohtla-Järve LV':
      return 'Kohtla-Järve linn';
    case 'Jõgeva ÜTK':
      return 'Jõgevamaa';
    case 'Harjumaa ÜTK':
      return 'Harjumaa';
    case 'Tartu MV':
      return 'Tartumaa';
    case 'Põlva MV':
      return 'Põlvamaa';
    case 'Narva LV':
      return 'Narva linn';
    case 'Hiiu MV':
      return 'Hiiumaa';
    case 'Pärnu MV':
      return 'Pärnumaa';
    case 'Sillamäe LV':
      return 'Sillamäe linn';
    default:
      return '';
  }
}

/*
 * Create a stream of Documents from valid CSV records
 */
function createDocumentStream(translations, prefix) {

  var badRecordCount=0;
  var sourceName = 'GTFS';
  var fullPrefix = sourceName + ':';

  if(prefix) {
    fullPrefix += prefix + ':'; // e.g. 'GTFS:HSL:'
    sourceName += prefix;
  }
  return through.obj(
    function write( record, enc, next ){
      try {
        var model_id = fullPrefix + record.stop_id;
        var name = record.stop_name;
        var authority = record.authority;
        var stopCode = '';
        var shortName;
        if (record.stop_code && record.stop_code !== '') {
          model_id += '#' + record.stop_code;
          shortName = record.stop_code;
          if (name.toLowerCase().indexOf(String(record.stop_code).toLowerCase())===-1) {
            // append to full name if not already appended
            stopCode = ' ' + record.stop_code;
          }
        }
        var fullName = name + stopCode;
        var type;
        if (record.location_type === '1') {
          type = 'station';
        } else {
          type = 'stop';
        }
        var doc = new peliasModel.Document( sourceName, type, model_id )
           .setName( 'default', fullName )
           .setName( 'fi', fullName )
           .setCentroid( { lon: record.stop_lon, lat: record.stop_lat } );

        if(shortName && shortName !== fullName) {
          doc.setName( 'short', shortName );
        }

        if(name !== fullName) {
          doc.setName( 'alternative', name ); // plain name without code part
        }

        if (authority && authority.length > 0) {
          doc.addParent('locality', mapLocality(authority), 'l:' + model_id);
        }

        if (translations) {
          var names = translations[name];
          if (names) {
            for (var lang in names) {
              var name2 = names[lang];
              if (name2 !== name) {
                doc.setName( lang, name2 + stopCode );
              }
            }
          }
        }
        var vehicleType = mapVehicleType(record.vehicle_type);
        if (vehicleType) {
          doc.addCategory(vehicleType);
        }
        if (type === 'station') {
          doc.setPopularity(1000000);
        } else {
          doc.setPopularity(10000);
        }

        this.push( doc );
      }
      catch ( ex ){
        badRecordCount++;
      }

      next();
    }, function end( done ) {
      logger.info('Bad record count: ' + badRecordCount);
      done();
    }
  );
}

module.exports = {
  create: createDocumentStream
};
