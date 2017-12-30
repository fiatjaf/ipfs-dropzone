Instead of uploading the dropped files to an URL, this subclass of [Dropzone.js](http://www.dropzonejs.com/) publishes them to [IPFS](https://ipfs.io/) with [js-ipfs](https://github.com/ipfs/js-ipfs) (no running local nodes needed).

Both [ipfs](https://www.npmjs.com/package/ipfs) and [dropzone](https://www.npmjs.com/package/dropzone) are peer dependencies.

## Usage

```js
const IPFSDropzone = require('ipfs-dropzone')

let dz = IPFSDropzone('#files', {
  ipfsRepoName: 'filemap.xyz',
  addRemoveLinks: true,
  accept: (file, done) => {
    if (file.size > 50000000) {
      done('Files must be smaller than 50MB.')
    } else {
      done()
    }
  }
})

dz.on('success', file => {
  console.log('file published to ipfs: ' + file.hash)

  dz.node.then(ipfs => {
    ipfs.files.cat(file.hash, (err, file) => {
      console.log(file.toString('utf-8'))
    })
  })
})
```

## Information

  * Most normal Dropzone features and events should work, but I'm not sure.
  * There's no way to cancel the process of adding a file.
  * A IPFS repo will automatically be created in the browser (in a IndexedDB) by js-ipfs, this repo will be named `"dz-ipfs"` if `ipfsRepoName` is not supplied.
  * I don't know how to publish this package in a way all JS transpilers and bundlers out there can understand. Please help me.

## Who's using this?

https://filemap.xyz

## What is the LICENSE?

The MIT License.
