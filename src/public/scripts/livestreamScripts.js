const socket = io('/livestream')
const videoGrid = document.getElementById('video-grid')
const startBtn = document.getElementById('start-button')
const endBtn = document.getElementById('end-button')
const myVideo = document.createElement('video')


const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/livestream',
    port: '3001'
})
// create element video.
myVideo.muted = true;//Mute my voice because no one heard my own voice.

// const peers = {}


function startLiveStream() {
    let myVideoStream
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream =>{
        myVideoStream = stream;
        addVideoStream(myVideo, stream)//add video into video-grid.

    //Listening new user to call.
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    //add new user. sent stream video current to user.
        socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
        })
    })
}


socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close() //disconnected with viewer.
})

//Connect user new with video and stream of host.
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)//send video and stream of host to user
    const video = document.createElement('video')
    call.on('stream',  userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call //add new user into list peer.
}

socket.emit('user-connected', userId =>{
    console.log('User connected: ' + userId)
})

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function getPeer(){
    const id = uuidv4();
    $('#peer-id').append(id);
    return id;
}

startBtn.addEventListener('click', e => {
    startLiveStream();
    // document.getElementById('peer-id').id(getPeer());
    document.getElementById("content").style.display = 'none'

})

endBtn.addEventListener('click', e => {

})