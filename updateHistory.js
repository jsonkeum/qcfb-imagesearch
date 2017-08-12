//Inserts new search record object into the history array.
module.exports = function (record, arr){
  if(arr.length < 10){
    arr.unshift(record);
  } else {
    arr.pop();
    arr.unshift(record);
  }
  return arr;
}
