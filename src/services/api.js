import { showError } from '@/services/crisp';
import fetch from 'isomorphic-fetch';
const DetectRTC = require('detectrtc');

const uuidv1 = require('uuid/v1');

const apiUrl = 'https://a.deephire.com/v1';
// const apiUrl = 'https://dev-a.deephire.com/v1/';

// const apiUrl = 'http://localhost:3000/v1/';
// const openTokApi = 'http://localhost:8081';
const openTokApi = 'https://tokbox.deephire.com';

export const fetchInterview = async id => {
  const resp = await fetch(`${apiUrl}/interviews/${id}`);
  if (resp.ok) {
    return await resp.json();
  }
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
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => data);
};

export const storeInterviewQuestion = async (
  interviewId,
  userId,
  userName,
  candidateEmail,
  interviewName,
  question,
  response,
  responseThumbnail
) => {
  console.log(response, responseThumbnail);

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
        response,
        responseThumbnail,
      },
      DetectRTC,
    }),
  });
  if (result.status === 201) {
    const location = result.headers.get('Location');
    if (location) {
      const n = location.lastIndexOf('/');
      const videosId = location.substring(n + 1);
      return videosId;
    }
  }
};

export const storeInterviewQuestionRework = async (
  {
    interviewId,
    userId,
    userName,
    candidateEmail,
    interviewName,
    question,
    response,
    responseThumbnail,
    uuid
  },
  createdBy
) => {

  const result = await fetch(`${apiUrl}/videos`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    //this throws an error strying to stringify DetectRtc, but it still works
    body: JSON.stringify({
      interviewId,
      userId,
      userName,
      candidateEmail,
      interviewName,
      responses: {
        question,
        response,
        responseThumbnail,
        uuid
      },
      DetectRTC,
    }),
  });
  if (result.status === 201) {
    const location = result.headers.get('Location');
    if (location) {
      const n = location.lastIndexOf('/');
      const videosId = location.substring(n + 1);
      if (createdBy) {
        notifyCandidate(userName, candidateEmail);
        notifyRecruiter(interviewId, userName, candidateEmail, interviewName, createdBy, videosId);
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
  var data = {
    type: 'interviewCompleted',
    id,
    candidateName,
    recipients: [createdBy || 'noemail@deephire.com'],
    candidateEmail,
    interviewName,
    videosId,
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

export const startArchive = async sessionId => {
  const res = await fetch(`${openTokApi}/archive/start/${sessionId}`, {
    method: 'POST',
  });
  if (res.status === 200) {
    const data = await res.json();
    const { id: archiveId } = data;
    localStorage.setItem('archiveId', archiveId);
    return data;
  }
  // already an archive for the session
  if (res.status === 500) {
    stopArchive(localStorage.getItem('archiveId'));
    return startArchive(sessionId);
  }
  return res.json();
};

export const getCredentials = () => {
  const uid = uuidv1();
  return fetch(`${openTokApi}/room/${uid}`).then(r => r.json());
};

//runs for 20 * 500 = 10000 = 10 seconds
export const checkVideo = async (url, n = 20) => {
  const options = {
    headers: {
      Range: 'bytes=0-1',
    },
  };
  try {
    const res = await fetch(url, options);
    await new Promise(resolve => setTimeout(() => resolve(), 500));

    if (res.status === 206) return url;
    else if (res.status === 416) {
      showError(
        'we noticed there was problem with the video playback on your video - try clicking retake and recoding again - let me know if you need help!'
      );
      console.log('No video recorded, thro error, 416 satus code');
    } else if (n < 1) {
      showError(
        'We noticed there was an error uploaing your video :( try clicking "retake" and recording again '
      );
      console.log('Video not found after 10 seconds');
    } else return await checkVideo(url, n - 1);
  } catch (err) {
    throw err;
  }
};
