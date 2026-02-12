import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../queries';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

  const [login] = useMutation(LOGIN, {
    
  });

	const submit = async (event) => {
		event.preventDefault();

		try {
			await login({ variables: { username, password } });
			console.log(`name: ${username}, password: ${password}`);
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	return (
		<div>
			{errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
			<form onSubmit={submit}>
				<div>
					username
					<input
						type='text'
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type='password'
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type='submit'>login</button>
			</form>
		</div>
	);
};

export default LoginForm;
