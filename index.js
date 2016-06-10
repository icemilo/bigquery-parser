function parseResponse(response) {
  if(!response instanceof Object){
    throw new Error('Invalid parameter type');
  }
  // Check if argument passed is valid
  if(response === undefined || response.schema === undefined) {
    throw new Error('Invalid parameter');
  }

  //Check if there are no rows return from Bigquery
  if(response.schema !== undefined && response.rows === undefined) {
    return {
      totalRows: 0,
      data: []
    };
  }

  // Check if query job is completed
  if(!response.jobComplete) {
    throw new Error('Job is not completed');
  }

  var rows = response.rows;
  var schemaFields = response.schema.fields;
  var columnNameArray = [];
  var valueArray = [];
  var finalArray = [];
  var noOfColumns = 0;

  schemaFields.forEach(function (fieldName) {
    columnNameArray.push(fieldName.name);
  });

  noOfColumns = columnNameArray.length;

  rows.forEach(function (rowObj) {
    var tmp = [];
    rowObj.f.forEach(function (row) {
      tmp.push(row.v);
    });

    if(tmp.length !== noOfColumns) {
      throw new Error('Number of column names and number of values in row is different');
    }

    valueArray.push(tmp);
  });

  for(var i = 0; i < valueArray.length; i++) {
    var tmpObj = {};
    for(var j = 0; j < columnNameArray.length; j++) {
      tmpObj[columnNameArray[j]] = valueArray[i][j];
    }
    finalArray.push(tmpObj);
  }

  // Return final result
  return {
    totalRows: valueArray.length, 
    data: finalArray
  };
}

module.exports = parseResponse;