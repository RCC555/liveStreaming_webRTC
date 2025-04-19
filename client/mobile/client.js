const socket = io();
let peerConnection;
const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
    // Add TURN server if needed for NAT traversal
  ]
};

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const userIdInput = document.getElementById('userId');
const userList = document.getElementById('userList');

async function register() {
  const userId = userIdInput.value;
  if (!userId) return alert('Please enter a user ID');
  socket.emit('register', userId);

  // Access webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = stream;
}

socket.on('user-list', (users) => {
  userList.innerHTML = '<option value="">Select a user</option>';
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user;
    option.text = user;
    userList.appendChild(option);
  });
});

socket.on('user-connected', (userId) => {
  const option = document.createElement('option');
  option.value = userId;
  option.text = userId;
  userList.appendChild(option);
});

socket.on('user-disconnected', (userId) => {
  const options = userList.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === userId) {
      userList.remove(i);
      break;
    }
  }
});

async function callUser() {
  const targetUser = userList.value;
  if (!targetUser) return alert('Please select a user to call');

  peerConnection = new RTCPeerConnection(config);

  const stream = localVideo.srcObject;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        candidate: event.candidate,
        target: targetUser
      });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { offer, target: targetUser });
}

socket.on('offer', async (data) => {
  peerConnection = new RTCPeerConnection(config);

  const stream = localVideo.srcObject;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        candidate: event.candidate,
        target: data.sender
      });
    }
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { answer, target: data.sender });
});

socket.on('answer', async (data) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
});

socket.on('ice-candidate', async (data) => {
  if (peerConnection) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
});
