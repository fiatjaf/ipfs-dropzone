const IPFS = require('ipfs')
const toBuffer = require('blob-to-buffer')
const Dropzone = require('dropzone')

class IPFSDropzone extends Dropzone {
  constructor (el, options) {
    options.url = 'https://ipfs.io/' // just to bypass the check.
    super(el, options)

    this.node = null
    this.ipfsRepoName = options.ipfsRepoName || 'dz-ipfs'
  }

  uploadFiles (files) {
    if (this.node === null) {
      this.node = new Promise((resolve) => {
        let node = new IPFS({ repo: this.ipfsRepoName })
        node.once('ready', () => {
          resolve(node)
        })
      })
    }

    for (let file of files) {
      this.emit('sending', file)
    }

    Promise.all([
      this.node,
      files,
      Promise.all(
        files.map(f =>
          new Promise((resolve, reject) => {
            toBuffer(f, (err, buf) => {
              if (err) return reject(err)
              resolve(buf)
            })
          })
        )
      )
    ])
      .then(([node, files, buffers]) => {
        for (let i = 0; i < files.length; i++) {
          let buf = buffers[i]
          let file = files[i]

          node.files.add(buf, {
            progress: loaded => {
              this._updateFilesUploadProgress([file], null, {
                loaded: loaded,
                total: file.size
              })
            }
          }, (err, res) => {
            let ipfsFile = res[0]
            file.hash = ipfsFile.hash
            file.path = ipfsFile.path

            if (err) {
              this._errorProcessing([file], `ipfs add error: ${err}`)
              return
            }

            this._finished([file])
          })
        }
      })
  }
}

module.exports = IPFSDropzone
