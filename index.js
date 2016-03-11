// Scrapes pages from the PMA website

import request from 'request'
import { writeFile } from 'fs'
import Promise from 'bluebird'

var arr = []
var start = 250000
var end = 273662
var written = 0
for (var i = start; i !== end; ++i) arr.push(i)

Promise.resolve(arr).map(scrape, { concurrency: 5 }).tap(()=>{ console.log('Written:', written) })

// var Xray = require('x-ray')
// var x = Xray()

let badTitle = 'Philadelphia Museum of Art - Collections  :  Search Collections'

function scrape(num){
 return new Promise((resolve, reject)=>{
   let url = `http://www.philamuseum.org/collections/permanent/${num}.html`
   let file = `html/${num}.html`
   request(url, (err, resp) => {
     if (err) {
       reject(err)
     } else {
       if (resp.body.indexOf(badTitle) === -1){
         writeFile(file, {flags: 'w'}, (err2) => {
           if (err2) {
             reject(err2)
           } else {
             console.log('File written', url)
             written++
             resolve()
           }
         })
       } else {
         console.log('No Data', url)
         resolve()
       }
     }
   })
 })
}
