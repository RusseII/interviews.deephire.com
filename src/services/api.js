import fetch from 'isomorphic-fetch';
const uuidv1 = require('uuid/v1');

const apiUrl = 'https://a.deephire.com/v1/';
// const apiUrl = 'http://localhost:3000/v1/';
// const openTokApi = 'http://localhost:8081';
const openTokApi = 'https://tokbox.deephire.com';

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

export const getCredentials = () => {
  const uid = uuidv1();
  return fetch(`${openTokApi}/room/${uid}`).then(r => r.json());
};

export const checkVideo = async (url, n = 100) => {
  const options = {
    headers: {
      Range: 'bytes=0-1',
    },
  };
  try {
    const res = await fetch(url, options);
    console.log(res.status);
    await new Promise(resolve => setTimeout(() => resolve(), 500));

    if (res.status === 206) return url;
    else if (res.status === 413) {
      console.log('No video recorded, thro error, 413 satus code');
    } else if (n < 1) {
      console.log('Video not found after 10 seconds');
    } else return await checkVideo(url, n - 1);
  } catch (err) {
    throw err;
  }
};
