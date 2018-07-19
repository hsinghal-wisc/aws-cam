import React from 'react';
import Webcam from 'react-webcam';
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1"
})

const rekognition = new AWS.Rekognition();

export default class Camera extends React.Component {
  constructor () {
    super()
    this.state = {
      screenshot: '',
      faceDetails: []
    }
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ screenshot: imageSrc })
  }

  analyze = () => {
    function getBinary(base64Image) {
      var binaryImg = atob(base64Image);
      var length = binaryImg.length;
      var ab = new ArrayBuffer(length);
      var ua = new Uint8Array(ab);
      for (var i = 0; i < length; i++) {
        ua[i] = binaryImg.charCodeAt(i);
      }
      return ab;
    }
    let image = getBinary(this.state.screenshot.slice(23))
    var params = {
        Image: {
         Bytes: image
        },
        Attributes: ['ALL']
       };
    rekognition.detectFaces(params, (err, data) => {
       if (err) {
         console.log(err, err.stack);
       } else {
         this.setState({faceDetails: data.FaceDetails[0]})
       }
    })
  }

  render () {
    return (
      <div className="camera-container">
        <div className="camera">
          <Webcam
            className="webcam-source"
            audio={false}
            height={300}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={300}
          />
          <button
          className="camera-button"
          type="button"
          onClick={this.capture}>
          Take A Selfie
        </button>
        </div>
        <div>
          <div className="screenshot-box">
            {this.state.screenshot === '' ? '' :
              <div>
                <img src={this.state.screenshot} />
                <button
                  className="analyze-button"
                  type="button"
                  onClick={this.analyze}>
                  Let Machines Judge You
                </button>
              </div>
            }
          </div>
        </div>
        {this.state.faceDetails.length === 0 ? [] :
          <div className="results">
            <div className="results-tags">
              You are {this.state.faceDetails.Gender.Value.toUpperCase()}
            </div>
            <div className="results-tags">
              You are {this.state.faceDetails.AgeRange.High} years old but really {this.state.faceDetails.AgeRange.Low} at heart
            </div>
            <div className="results-tags">
              You are mostly {this.state.faceDetails.Emotions[0].Type},
               maybe {this.state.faceDetails.Emotions[1].Type}, and slightly {this.state.faceDetails.Emotions[2].Type}}
            </div>
          </div>
        }
      </div>
    )
  }
}
