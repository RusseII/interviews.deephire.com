/* global $crisp */

function openChat() {
  $crisp.push(['do', 'chat:open']);
}

function setDetails(email, nickname) {
  $crisp.push(['set', 'user:email', email]);
  $crisp.push(['set', 'user:nickname', [nickname]]);
}
function setCompany(recruiter, interviewName) {
  $crisp.push(['set', 'user:company', [recruiter, { employment: ['Job Seeker', interviewName] }]]);
}

async function candidateSendMessage(msg) {
  $crisp.push(['do', 'chat:open']);
  await new Promise(resolve =>
    setTimeout(() => {
      resolve('Added Delay');
    }, 1500)
  );

  $crisp.push(['do', 'message:send', ['text', msg]]);
  await new Promise(resolve =>
    setTimeout(() => {
      resolve('Added Delay');
    }, 5000)
  );

  const name = $crisp.get('user:nickname');

  let firstName;
  if (name) firstName = name.split(' ')[0];
  else firstName = 'there';
  const firstNameCapital = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  $crisp.push([
    'do',
    'message:show',
    [
      'text',
      `Hey ${firstNameCapital}, I can look into that for you. Have you checked out our supported browser page?`,
    ],
  ]);
  await new Promise(resolve =>
    setTimeout(() => {
      resolve('Added Delay');
    }, 7000)
  );
  $crisp.push([
    'do',
    'message:show',
    [
      'text',
      'Supported Browser List — https://help.deephire.com/en/article/supported-browser-list-agyz4m/',
    ],
  ]);
  $crisp.push(['do', 'helpdesk:query', ['Supported Browsers']]);
}
async function showError(
  msg = 'we saw there was some type of error - let me know if you need help!'
) {
  await new Promise(resolve =>
    setTimeout(() => {
      resolve('Added Delay');
    }, 1500)
  );

  const name = $crisp.get('user:nickname');

  let firstName;
  if (name) firstName = name.split(' ')[0];
  else firstName = 'there';
  const firstNameCapital = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  $crisp.push(['do', 'message:show', ['text', `Hey ${firstNameCapital}, ${msg}`]]);
}
function setEvent(event) {
  $crisp.push(['set', 'session:event', [[['error', event, 'red']]]]);
}

export { openChat, setDetails, setCompany, candidateSendMessage, showError, setEvent };

