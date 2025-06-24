const { useState, useEffect } = React;

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // call backend login API
    onLogin({ email });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RUNYA Login</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="border w-full p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border w-full p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}

function Dashboard({ user }) {
  const [quote, setQuote] = useState('');
  const [mode, setMode] = useState('light');

  useEffect(() => {
    fetch('https://zenquotes.io/api/random')
      .then(res => res.json())
      .then(data => setQuote(data[0].q))
      .catch(() => setQuote('Stay motivated!'));
  }, []);

  return (
    <div className={mode === 'dark' ? 'bg-gray-800 text-white h-full p-4' : 'bg-white h-full p-4'}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Welcome, {user.email}</h2>
        <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} className="border px-2 rounded">{mode === 'light' ? 'Dark' : 'Light'}</button>
      </div>
      <p className="italic mb-2">{quote}</p>
      <p>Your dashboard goes here.</p>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard user={user} />;
}

ReactDOM.render(<App />, document.getElementById('root'));
