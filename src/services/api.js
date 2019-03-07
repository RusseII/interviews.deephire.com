import fetch from 'isomorphic-fetch';


const apiUrl = 'https://dev-a.deephire.com/v1/';
// const apiUrl = 'http://localhost:3000/v1/';

export const fetchInterview = id => {
  return fetch(`${apiUrl}interviews/${id}`)
    .then(response => response.json())
    .then(data => data);
};

export const sendEmail = data => {
  return fetch(`${apiUrl}/emails`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => data);
};


export const storeInterviewQuestion = (
  interviewId,
  userId,
  userName,
  candidateEmail,
  interviewName,
  question,
  response,
) => {
  fetch(`${apiUrl}videos`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      interviewId,
      userId,
      userName,
      candidateEmail,
      interviewName,
      responses: {
        question,
        response,
      },
    }),
  });
};






export const notifyRecruiter = (id, candidateName, candidateEmail, interviewName) => {
var data = {
  type: "interviewCompleted",
  id,
  candidateName,
  email: [],
  candidateEmail,
  interviewName
};
// console.log(data)

fetch("https://dev-a.dephire.com/emails", {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
}