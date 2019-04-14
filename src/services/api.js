import fetch from 'isomorphic-fetch';

const apiUrl = 'https://a.deephire.com/v1/';
// const apiUrl = 'http://localhost:3000/v1/';
const openTokApi = 'http://localhost:8080';

export const fetchInterview = id => {
  return fetch(`${apiUrl}interviews/${id}`)
    .then(response => response.json())
    .then(data => data);
};

export const fetchCompanyInfo = id => {
  return fetch(`${apiUrl}companies/${id}`)
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(data => data);
};

export const sendEmail = data => {
  return fetch(`${apiUrl}emails`, {
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
  response
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

export const notifyRecruiter = (id, candidateName, candidateEmail, interviewName, createdBy) => {
  var data = {
    type: 'interviewCompleted',
    id,
    candidateName,
    recipients: [createdBy || 'noemail@deephire.com'],
    candidateEmail,
    interviewName,
  };
  // console.log(data)

  fetch('https://dev-a.deephire.com/v1/emails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const notifyCandidate = (candidateName, candidateEmail) => {
  var data = {
    type: 'jobSeekerCompleted',
    candidateName,
    recipients: [candidateEmail || 'noCandidateEmail@deephire.com'],
    candidateEmail,
  };
  // console.log(data)

  fetch('https://dev-a.deephire.com/v1/emails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const stopArchive = archiveId => {
  return fetch(`${openTokApi}/archive/${archiveId}/stop`, {
    method: 'POST',
  });
};

export const startArchive = archiveId => {
  return fetch(`${openTokApi}/archive/start/${archiveId}`, {
    method: 'POST',
  });
};
