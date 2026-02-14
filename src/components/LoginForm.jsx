import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../queries';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setError, setToken }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();
	const [login] = useMutation(LOGIN, {
		onCompleted: (data) => {
			const token = data.login.value;
			setToken(token);
			localStorage.setItem('library-user-token', token);
			navigate('/books');
		},
		onError: (error) => {
			setError(error.message);
		},
	});

	const submit = async (event) => {
		event.preventDefault();

		try {
			await login({ variables: { username, password } });
			console.log(`name: ${username}, password: ${password}`);
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div>
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
