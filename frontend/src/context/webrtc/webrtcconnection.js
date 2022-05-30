import Webrtccontext from "./Webrtccontext";
import { io } from 'socket.io-client'
import React from 'react'

const socket = io('http://localhost:3001')
const webrtcconnection = (props) => {


  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((strm) => {
        setStream(strm);
        myVideo.current.srcObject = strm;

      })
    socket.on('me', (id) => setMe(id));



  }, [])


  const callUser = (id) => {
    const peer = new peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userTocall: id, signalData: data, from: me, name });

    })
    peer.on('stream', (str) => {
      userVideo.current.srcObject = str;
    })

    socket.on('callAc', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;


  };

  const anscall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answercall', { signal:data,to:call.from});

    })
    peer.on('stream', (str) => {
      userVideo.current.srcObject = str;
    })


    peer.signal(signal);
    
    connectionRef.current = peer;


  }



  const callend = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();

  };




  return (<Webrtccontext.Provider value={{}} >
    {props.children}
  </Webrtccontext.Provider>)


}

export default webrtcconnection