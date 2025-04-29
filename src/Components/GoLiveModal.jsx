import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { apiRequest } from '../utils/api';

function GoLiveModal({ selectedCategory, onClose }) {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [caption, setCaption] = useState('');

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const startRecording = () => {
    const stream = webcamRef.current.stream;
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!caption || recordedChunks.length === 0) {
      alert('Please open camera, record a video, and enter a caption.');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const file = new File([blob], 'live-video.webm', { type: 'video/webm' });

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('media', file);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('category', selectedCategory); // append selected category

      formData.append('location', latitude+" "+latitude); // append selected category

      try {
           const result = await apiRequest({
                method: 'POST',
                route: '/users/upload-post', // <-- your login endpoint
                formData,
              });

        if (result.success) {
          alert('Live video uploaded successfully!');
          handleCancel(); // Reset everything on success
          window.location.reload();
        } else {
          alert(result.message || 'Failed to upload video.');
        }
      } catch (error) {
        alert('Error uploading video.');
        console.error(error);
      }
    }, (err) => {
      alert('Unable to access location.');
      console.error(err);
    });
  };

  const handleCancel = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }
    setShowCamera(false);
    setRecording(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
    setCaption('');
    onClose(); // Close the modal
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center' }}>Upload a Live Video</h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Category: <strong>{selectedCategory}</strong>
        </p>

        <div 
          style={{
            border: '2px solid #ccc', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem', 
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={showCamera ? undefined : openCamera}
        >
          {showCamera ? (
            <Webcam
              audio
              ref={webcamRef}
              videoConstraints={videoConstraints}
              style={{ width: '100%' }}
            />
          ) : (
            <div style={{ color: '#666' }}>
              <img 
                src="https://img.icons8.com/ios/50/000000/camera--v1.png" 
                alt="Open Camera" 
                style={{ marginBottom: '0.5rem' }}
              />
              <div>Click to open camera</div>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Click to add caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            backgroundColor: '#eee',
            border: 'none',
            borderRadius: '4px'
          }}
        />

        {showCamera && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {recording ? (
              <button onClick={stopRecording} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>
                Stop Recording
              </button>
            ) : (
              <button onClick={startRecording} style={{ backgroundColor: '#00e0b8', color: 'white', padding: '0.5rem 1rem' }}>
                Start Recording
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleCancel} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ backgroundColor: '#00e0b8', color: 'white', padding: '0.5rem 1rem' }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoLiveModal;
