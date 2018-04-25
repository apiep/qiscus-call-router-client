(function () {
  console.log('::Recording::');

  var config = {
    recorderType: MediaStreamRecorder,
    mimeType: 'video/webm\;codecs=vp9'
  };

  function CRecording () {
    this.uploadQueues = [];
    this.uploading = null;
    this.doneUploading = [];
    this.currentRecord = null;
    this.isRecording = false;
    window.setInterval(function () {
      this.watch();
    }.bind(this), 500);
  }

  CRecording.prototype = Object.create(Object.prototype);
  CRecording.prototype.isBusy = function () {
    return this.uploading != null || this.uploadQueues.length > 0;
  };
  CRecording.prototype.watch = function () {
    if (this.uploadQueues.length <= 0 || this.uploading != null) return;
    this.uploading = this.uploadQueues.splice(0, 1).pop()
    var filename = `recording-${this.uploading.id}.webm`;
    var file = new File([this.uploading.data], filename);
    this.onUpdate();
    this.upload(file)
      .then((resp) => {
        console.log('resp', resp);
        var uploadedFile = Object.assign({}, this.uploading, {
          url: resp.results.file.url
        });
        this.doneUploading.push(uploadedFile);
        this.uploading = null;
        this.onUpdate();
      })
      .catch((error) => {
        console.error('error when uploading', error);
      });
  };
  CRecording.prototype.record = function (stream) {
    var record = RecordRTC(stream, config);
    this.currentRecord = record;
    this.currentRecord.startRecording();
    this.isRecording = true;
    return this.currentRecord;
  };
  CRecording.prototype.upload = function (file) {
    var url = `https://${CALL_SDK_APP_ID}.qiscus.com/api/v2/mobile/upload`
    var formData = new window.FormData();
    formData.append('file', file)
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.response);
          return resolve(response);
        } else {
          return reject(xhr);
        }
      };
      xhr.send(formData);
    });
  };

  CRecording.prototype.remoteStream = function (stream) {
    this.record(stream);
  };
  CRecording.prototype.close = function () {
    if (this.currentRecord == null) return;
    var id = (new Date()).getTime();
    this.currentRecord.stopRecording(function () {
      var blob = this.currentRecord.getBlob();
      this.uploadQueues.push({
        id: id,
        data: blob,
      });
      this.isRecording = false;
    }.bind(this));
  };
  CRecording.prototype.onUpdate = function () {};

  window.Recording = window.Recording || new CRecording();
})();
