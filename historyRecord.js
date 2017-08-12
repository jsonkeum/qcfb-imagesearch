//Creates a history record object with date stamp
module.exports = function(string){
  return {
    "term":string,
    "time":new Date().toString()
  };
}
