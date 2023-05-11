import { useState, useRef } from 'react'

import {
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate
} from 'react-router-dom'

import { useField } from './hooks'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  return (
    <div>
      {notification}
    </div>
  )
}

const Menu = ({ notification }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <>
      <div>
        <Link style={padding} to="/">anecdotes</Link>
        <Link style={padding} to="/create">create new</Link>
        <Link style={padding} to="/about">about</Link>
      </div>
      {notification && <div><Notification notification={notification} /></div>}
    </>
  )
}

const Anecdote = ({ anecdote }) => {
  // content author info votes
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const contentField = useField('text')
  const authorField = useField('text')
  const infoField = useField('text')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e)
    const content = contentField.value
    const author = authorField.value
    const info = infoField.value
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    props.notification(
      `a new anecdote ${content} created!`
    )
    navigate('/')
  }

  const handleReset = (e) => {
    console.log(e)
    contentField.onReset()
    authorField.onReset()
    infoField.onReset()
  }

  // https://react.dev/reference/react-dom/components/common#common-props
  // onReset={} on olemeassa
  return (
    <div>
      <h2>create a new anecdote</h2>
      
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input name='content' {...contentField} />
        </div>
        <div>
          author
          <input name='author' {...authorField} />
        </div>
        <div>
          url for more info
          <input name='info' {...infoField} />
        </div>
        <button>create</button>
        <button type='reset'>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState(null)
  // notifikaation piilotus viitteen avulla
  // Osa5 käytti Togglablessa
  const notificationRef = useRef(null)

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdoteById(Number(match.params.id))
    : null

  // https://react.dev/learn/referencing-values-with-refs
  // täältä setInterval esimerkin mukaisesti ref setTimeoutin id
  const showAnecdoteCreatedNotification = (notification) => {
    console.log('näytetään ilmoitus: ', notification)
    clearTimeout(notificationRef.current)
    setNotification(notification)
    notificationRef.current = setTimeout(() =>
      hideNotification(notification),5000)
  }

  const hideNotification = (notification) => {
    console.log('piiloitetaan ilmoitus: ', notification)
    clearTimeout(notificationRef.current)
    setNotification(null)
  }


  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu notification={notification} />
      <Routes>
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote} />} />
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='/about' element={<About />} />
        <Route path='/create' element={<CreateNew addNew={addNew} notification={showAnecdoteCreatedNotification} />} />
      </Routes>
      <div>
        <br />
        <Footer />
      </div>      
    </div>
  )
}

export default App
