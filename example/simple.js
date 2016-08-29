'use strict';

var GraphQlQuery = require('../dist/src/GraphQlQuery');


/*
{
 user( id:3500401 ) {
    id,
    nickname : name,
    isViewerFriend,
    
    image: profilePicture( size:50 ) {
        uri,
        width,
        height
    }
  }
}
*/

let profilePicture = new GraphQlQuery('profilePicture', {size: 50})
    .select('uri', 'width', 'height');

let user = new GraphQlQuery('user', {id: 3500401})
    .select('id', {'nickname': 'name'}, 'isViewerFriend', {'image': profilePicture});


console.log('user', user.toString());
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

let FetchLeeAndSam = new GraphQlQuery('FetchLeeAndSam');

let lee = new GraphQlQuery({lee: 'user'}, {id: '1'});
lee.select('name');

console.log('lee', lee.toString());

let sam = new GraphQlQuery({sam: 'user'}, {id: '2'});
sam.select('name');
console.log('sam', sam + '');

console.log(lee.join(sam).toString());
