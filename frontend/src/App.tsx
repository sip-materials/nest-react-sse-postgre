import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'
import { IMessage } from './interfaces/message.interface'
import moment from 'moment'

function App() {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const sendMessage = () => {
    axios.post('http://localhost:3000/api/add-message', {
      content: message
    }).then((res: { data: IMessage }) => {
      setMessage('')
      // setMessages((_prev) => [..._prev, res.data])
    }).catch((err: any) => {
      console.error(err)
    })
  }
  useEffect(() => {
    axios.get('http://localhost:3000/api/all-messages').then((res: { data: IMessage[] }) => {
      setMessages(res.data)
    }).catch((err: any) => {
      console.error(err)
    })
    const eventSource = new EventSource('http://localhost:3000/api/sse');
    eventSource.addEventListener('message', (event) => {
      const new_message: IMessage = JSON.parse(event.data);
      setMessages((_prev) => {
        const index = _prev.map(({ id }) => id).indexOf(new_message.id)
        if (index < 0) {
          return [..._prev, new_message]
        } else {
          return _prev.map((_el) => _el.id === new_message.id ? new_message : _el)
        }
      })
    })
    return () => {
      eventSource.close()
    }
  }, [])
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {messages.map((message, id) => (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} key={id}>
            <span>{message.id}</span>
            <span>{message.content}</span>
            <span>{moment.unix(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
