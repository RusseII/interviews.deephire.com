import fetch from 'isomorphic-fetch';
const DetectRTC = require('detectrtc');

const apiUrl = 'https://a.deephire.com/v1';
// const apiUrl = 'https://dev-a.deephire.com/v1/';

// const apiUrl = 'http://localhost:3000/v1';
// const openTokApi = 'http://localhost:8081';



export const submitFeedback = async (interviewId, companyId, feedback) => {
  const data = {...feedback, interviewId, companyId}
  const resp = await fetch(`${apiUrl}/interviews/${interviewId}/feedback`, { method: "POST", headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }, body: JSON.stringify(data)} );
  return resp;
};



export const fetchInterview = async id => {
  const resp = await fetch(`${apiUrl}/interviews/${id}`);
  if (resp.ok) {
    return await resp.json();
  }
  return null;
};

export const fetchCompanyInfo = companyId => {
  return fetch(`${apiUrl}/companies/${companyId}`)
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

export const storeInterviewQuestionRework = async (
  { interviewId, userId, userName, candidateEmail, interviewName, question, medias, uuid },
  createdBy,
  companyId, completeInterviewData, completion
) => {

  const result = await fetch(`${apiUrl}/videos`, {
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
        ...medias,
        uuid,
      },
      completeInterviewData
      // DetectRTC
    }),
  });

  if (result.status === 201) {
    const location = result.headers.get('Location');
    if (location) {
      const n = location.lastIndexOf('/');
      const videosId = location.substring(n + 1);
      if (completion) {
        const { thumbnail640x480 } = medias;
        victoryEvent(
          interviewId,
          userName,
          candidateEmail,
          interviewName,
          createdBy,
          videosId,
          thumbnail640x480,
          companyId, completeInterviewData
        );
        notifyCandidate(userName, candidateEmail);
        notifyRecruiter(
          interviewId,
          userName,
          candidateEmail,
          interviewName,
          createdBy,
          videosId,
          thumbnail640x480
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
  videosId,
  thumbnail640x480
) => {
  var data = {
    template: 'completed-interview-recruiter-notification',
    id,
    candidateName,
    recipients: [createdBy || 'noemail@deephire.com'],
    candidateEmail,
    interviewName,
    candidateUrl: `https://recruiter.deephire.com/one-way/candidates/candidate/?id=${videosId}`,
    candidateThumbnail: thumbnail640x480,
  };

  fetch(`${apiUrl}/emails`, {
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
    template: 'job-seeker-completed-interview',
    candidateName,
    recipients: [candidateEmail || 'noCandidateEmail@deephire.com'],
    candidateEmail,
  };

  fetch(`${apiUrl}/emails`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const startedEvent = (candidateEmail, userName, companyId, interviewName, completeInterviewData) => {
  var data = {
    candidateEmail,
    userName,
    companyId,
    interviewName,
    completeInterviewData
  };

  fetch(`${apiUrl}/events/started`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};


export const clickedEvent = (candidateEmail, userName, companyId, interviewName, completeInterviewData) => {
  var data = {
    candidateEmail,
    userName,
    companyId,
    interviewName,
    completeInterviewData
  };

  fetch(`${apiUrl}/events/clicked`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
export const victoryEvent = (
  interviewId,
  candidateName,
  candidateEmail,
  interviewName,
  createdBy,
  videosId,
  thumbnail640x480,
  companyId, completeInterviewData
) => {

  const data = {
    thumbnail640x480,
    createdBy,
    userName: candidateName,
    candidateEmail,
    interviewId,
    companyId,
    interviewName,
    candidateUrl: `https://recruiter.deephire.com/one-way/candidates/candidate/?id=${videosId}`,
    completeInterviewData
  };

  fetch(`${apiUrl}/events/victory`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
