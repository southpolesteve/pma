// Used for cleaning out pages with no data in them

import { readFile, unlink } from 'fs'
import Promise from 'bluebird'

var arr = []
var start = 0
var end = 150000
for (var i = start; i <= end; ++i) arr.push(i)

let missing = 0
let removed = 0
let good = 0

Promise.resolve(arr).map(clean, { concurrency: 5 }).then(()=>{
  console.log('Missing', missing)
  console.log('Removed', removed)
  console.log('Good', good)
})

let badTitle = 'Philadelphia Museum of Art - Collections  :  Search Collections'

function clean(num){
 return new Promise((resolve)=>{
   let file = `html/${num}.html`
   readFile(file, 'utf8', (err, content)=>{
     if (err) {
       missing++
       resolve()
     } else {
       if (content.indexOf(badTitle) !== -1 || content.indexOf('[object Object]') !== -1){
         unlink(file, (err)=>{
           if (err) {
             console.log(err)
           } else {
             removed++
             resolve()
           }
         })
       } else {
         good++
         resolve()
       }
     }
   });
 })
}
