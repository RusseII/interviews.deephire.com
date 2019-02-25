let Vimeo = require('vimeo').Vimeo;
//set client here with secret key

const vimeo = (path) => {
    console.log(path)
    let file_name = path
    client.upload(
      file_name,
      {
        'name': 'Untitled',
        'description': 'testing'
      },
      function (uri) {
        console.log('Your video URI is: ' + uri);
        client.request(uri + '?fields=link', function (error, body, statusCode, headers) {
            if (error) {
              console.log('There was an error making the request.')
              console.log('Server reported: ' + error)
              return
            }
          
            console.log('Your video link is: ' + body.link)
          })
      },
      function (bytes_uploaded, bytes_total) {
        var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
        console.log(bytes_uploaded, bytes_total, percentage + '%')
      },
      function (error) {
        console.log('Failed because: ' + error)
      }
    )

}

export default vimeo
