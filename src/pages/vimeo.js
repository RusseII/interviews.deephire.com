import {storeInterviewQuestion} from "@/services/api"

let Vimeo = require('vimeo').Vimeo;

let client = new Vimeo("0d543a3d71538837dee05c464eeb06f2d9094588", "OuZu7ZDXuNQJLKlS7+LOMx7rvW5B7cWrkwooCDyn7pSkIBDrS2SUxkQdbm2vfTWzW4T2Jb6XUVZ/lfYt19SXbDM2hxcH/odD8maw+TGyk9U6pAXSQBRGVld5i2+v2gpw", "061648e6439a87d8f9468d31a7f1164c");
const vimeoUpload = (path,interviewId,
  userId,
  userName,
  candidateEmail,
  interviewName,
  question) => {
    return new Promise((resolve, reject) => {
    console.log(path)
    let file_name = path
    client.upload(
      file_name,
      {
        'name': `${userName} ${candidateEmail} 's video interview `,
        'description':
         `userId: ${userId}
         userName: ${userName}
         candidateEmail: ${candidateEmail}
         interviewName: ${interviewName}
         question: ${question}`
      },
      function (uri) {
        console.log('Your video URI is: ' + uri);
        client.request(uri + '?fields=link', function (error, body, statusCode, headers) {
            if (error) {
              console.log('There was an error making the request.')
              console.log('Server reported: ' + error)
              reject("error")
            }
            storeInterviewQuestion(
              interviewId,
              userId,
              userName,
              candidateEmail,
              interviewName,
              question,
              body.link)
            console.log('Your video link is: ' + body.link)
            resolve(body.link)
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

    })}

export default vimeoUpload
