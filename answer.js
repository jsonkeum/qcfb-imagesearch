//Formats the payload into an array of objects
module.exports = (arr) => {
  var results = [];
  for(var i = 0; i < arr.length; i++){
    results.push({
      url:arr[i].link,
      snippet:arr[i].snippet,
      thumbnail:arr[i].image.thumbnailLink,
      context:arr[i].image.contextLink
    });
  }
  return results;
}
