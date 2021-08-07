import './App.css';
import opencage from 'opencage-api-client';
import { useState, useRef } from 'react';

function App() {
  const locationForm = useRef(null)
  const [outletName, setOutletName] = useState('')
  const [outletStatus, setOutletStatus] = useState('initial')
  const handleSubmit = async e => {
    e.preventDefault();
    const key = 'f3837c68ff684969be545a3d84b12f01'
    const form = locationForm.current
    opencage.geocode({ key, q: form['location'].value }).then(response => {
      const { geometry } = response.results[0];
      const { lat, lng } = geometry
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      };
      fetch('http://localhost:4000/get_outlet_identifier', requestOptions)
        .then(response => response.json()).then(data => {
          if (data.status === 'found') {
              setOutletName(data.outlet)
              setOutletStatus('found')
            }
            else setOutletStatus('not_found')
        });
    });
    e.target.reset();
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit} ref={locationForm}>
          <h1>Welcome to Honest food</h1>
          <p>Please enter your location:
            <input
              type="text"
              name={'location'}
            /></p>
          <p><button type="submit" value="Submit">Submit</button></p>
          {outletStatus === 'found' && <p> Your outlet is: {outletName} </p>}
          {outletStatus === 'not_found' && <p> No nearby outlet found </p>}
        </form>
      </header>
    </div>
  );
}

export default App;
