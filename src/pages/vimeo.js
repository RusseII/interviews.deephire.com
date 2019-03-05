import {storeInterviewQuestion} from "@/services/api"

let Vimeo = require('vimeo').Vimeo;

let client = new Vimeo("")
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
