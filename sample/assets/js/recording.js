(function () {
  console.log('::Recording::');

  var config = {
    recorderType: MediaStreamRecorder,
    mimeType: 'video/webm\;codecs=vp8'
  };

  function CRecording () {
    this.uploadQueues = [];
    this.uploading = null;
    this.doneUploading = [];
    this.currentRecord = null;
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
    var file = new File([this.uploading.blob], filename);
    this.upload(file)
      .then(() => {
        this.uploading = null;
      })
      .catch((error) => {
        console.error('error when uploading', error);
      });
  };
  CRecording.prototype.record = function (stream) {
    var record = RecordRTC(stream, config);
    this.currentRecord = record;
    this.currentRecord.startRecording();
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

  CRecording.prototype.onRemoteStream = function (stream) {
    this.record(stream);
  };
  CRecording.prototype.onClose = function () {
    if (this.currentRecord == null) return;
    var id = (new Date()).getTime();
    this.currentRecord.stopRecording(function () {
      var blob = this.currentRecord.getBlob();
      console.log('blob', blob);
      console.log('_blob', this.currentRecord.blob);
      this.uploadQueues.push({
        id: id,
        data: blob,
      });
    }.bind(this));
  };

  window.Recording = window.Recording || new CRecording();
})();
