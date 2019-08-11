const conditionalLogicForOneClient = {
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
    }
  },
  defaultFileList: [
    {
      uid: '1',
      name: 'HR Director.docx',
      url: 'https://s3.amazonaws.com/deephire/logos/HR+Director.docx'
    },
    {
      uid: '2',
      name: 'Electrocraft Overview.pdf',
      url: 'https://s3.amazonaws.com/deephire/logos/Electrocraft+overview.pdf'
    }
  ]
};

export default conditionalLogicForOneClient;
