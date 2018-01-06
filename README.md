Instead of uploading the dropped files to an URL, this subclass of [Dropzone.js](http://www.dropzonejs.com/) publishes them to [IPFS](https://ipfs.io/) with [js-ipfs](https://github.com/ipfs/js-ipfs) (no running local nodes needed).

Both [ipfs](https://www.npmjs.com/package/ipfs) and [dropzone](https://www.npmjs.com/package/dropzone) are peer dependencies.

## Usage

```js
const IPFSDropzone = require('ipfs-dropzone')

let dz = IPFSDropzone('#files', {
  /*
    the name of the repo which will store the IPFS blocks in the browser.
    this name will be used by IPFS to create the IndexedDB databases.

    defaults to "ipfs-dropzone"
  */
  ipfsRepoName: 'filemap.xyz',

  /*
    ipfsPath is a function that takes the dropzone file object
    and returns a string that will be used as the path when calling
    https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add

    defaults to (file) => file.name
  */
  ipfsPath: file => file.name

  // all other options you'll normally pass to dropzone go here.
})

dz.on('success', file => {
  /*
    everywhere the normal dropzone file object will now have a
    property called "ipfs" which contains the result to the call to
    https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
  */

  console.log('file published to ipfs: ' + file.ipfs[0].hash)

  /*
    your dropzone object will also have the property "node", which
    resolves to the IPFS node the dropzone object is using.
    it is a Promise because the IPFS node is only initialized at the
    moment of the first file upload.
  */
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
  * I don't know how to publish this package in a way all JS transpilers and bundlers out there can understand. Please help me.
  * Please read the source if something is unclear. The source is really small.

## Who's using this?

  * https://filemap.xyz

## What is the LICENSE?

The MIT License.

## Visitor statistics for this repository

![](http://ght.trackingco.de/fiatjaf/ipfs-dropzone)

(From the GitHub API and http://ght.trackingco.de/)
