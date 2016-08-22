'use strict';

var GraphQlQuery = require('../');


/*
{
 user( id:3500401 ) {
    id,
    nickname : name,
    isViewerFriend,
    
    profilePicture( size:50 ) {
        uri,
        width,
        height
    }
  }
}
*/

let profilePicture = new GraphQlQuery("profilePicture",{size : 50});
    profilePicture.find( "uri", "width", "height");
let user = new GraphQlQuery("user",{id : 3500401});
    user.find(["id", {"nickname":"name"}, "isViewerFriend",  {"image":profilePicture}])

  console.log("user",user+"");
/*

query FetchLeeAndSam {
  lee: user(id: "1") {
    name
  }
  sam: user(id: "2") {
    name
  }
}
*/

let FetchLeeAndSam = new GraphQlQuery("FetchLeeAndSam");

let lee = new GraphQlQuery("user",{id : '1'});
  lee.setAlias('lee');
  lee.find({name:true});
  console.log("lee",lee.toString());
  
let sam = new GraphQlQuery("user","sam");
  sam.filter({id : '2'});
  sam.find("name");
  console.log("sam",sam+"");
  
 console.log(FetchLeeAndSam.find(lee,sam)+"")
