import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const getCountry = async (fullName) => {
  const apiURL = `https://restcountries.com/v3.1/name/${fullName}?fullText=true`
  try {
    const response = await axios.get(apiURL)
    if (response.status === 200) {
      return response.data
    }
  } catch (exception) {
    console.log(exception)
    return null
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const fetchCountry = async (name) => {
      if (name) {
        const response = await getCountry(name)
        if (response) {
          setCountry({ data: response[0], found: true })
        } else {
          setCountry({ found: false })
        }
      }
    }
    fetchCountry(name)
  },[name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital[0]} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App