import fetch from 'isomorphic-fetch';

const DetectRTC = require('detectrtc');

const apiUrl = 'https://a.deephire.com/v1';
// const apiUrl = 'https://dev-a.deephire.com/v1/';

// const apiUrl = 'http://localhost:3000/v1/';
// const openTokApi = 'http://localhost:8081';

export const fetchInterview = async id => {
  try {
    if(id) {
      const resp = await fetch(`${apiUrl}/interviews/${id}`);
      if (resp.ok) {
        return await resp.json();
      }
    }
  } catch (e) {}
  return null;
};

export const fetchCompanyInfo = id => {
  return fetch(`${apiUrl}/companies/${id}`)
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
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => data);
};

export const storeInterviewQuestionRework = async (
  {
    interviewId,
    userId,
    userName,
    candidateEmail,
    interviewName,
    question,
    medias,
    uuid
  },
  createdBy
) => {
  console.log(DetectRTC);

  const result = await fetch(`${apiUrl}/videos`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      interviewId,
      userId,
      userName,
      candidateEmail,
      interviewName,
      responses: {
        question,
        ...medias,
        uuid
      }
      // DetectRTC
    })
  });
  if (result.status === 201) {
    const location = result.headers.get('Location');
    if (location) {
      const n = location.lastIndexOf('/');
      const videosId = location.substring(n + 1);
      if (createdBy) {
        notifyCandidate(userName, candidateEmail);
        notifyRecruiter(
          interviewId,
          userName,
          candidateEmail,
          interviewName,
          createdBy,
          videosId
        );
      }
      return videosId;
    }
  }
};

export const notifyRecruiter = (
  id,
  candidateName,
  candidateEmail,
  interviewName,
  createdBy,
  videosId
) => {
  const data = {
    type: 'interviewCompleted',
    id,
    candidateName,
    recipients: [createdBy || 'noemail@deephire.com'],
    candidateEmail,
    interviewName,
    videosId
  };

  fetch(`${apiUrl}/emails`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

export const notifyCandidate = (candidateName, candidateEmail) => {
  const data = {
    type: 'jobSeekerCompleted',
    candidateName,
    recipients: [candidateEmail || 'noCandidateEmail@deephire.com'],
    candidateEmail
  };

  fetch('https://a.deephire.com/v1/emails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};
