import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendation from './components/Recommendation';

const App = () => {
	const [page, setPage] = useState('authors');
	const [errorMessage, setErrorMessage] = useState(null);
	const [token, setToken] = useState(
		localStorage.getItem('library-user-token'),
	);

	const client = useApolloClient();

	const onLogout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	const notify = (message) => {
		setErrorMessage(message);
		setTimeout(() => {
			setErrorMessage(null);
		}, 10000);
	};

	return (
		<div>
			{token && (
				<div>
					<Link to={'/'}>
						<button onClick={() => setPage('authors')}>authors</button>
					</Link>
					<Link to={'/books'}>
						<button onClick={() => setPage('books')}>books</button>
					</Link>
					<Link to={'/add_book'}>
						<button onClick={() => setPage('add')}>add book</button>
					</Link>
					<Link to={'/recommend'}>
						<button onClick={() => setPage('recommend')}>recommend</button>
					</Link>
					<button onClick={onLogout}>logout</button>
					{errorMessage && (
						<div style={{ color: 'red', marginTop: '1rem' }}>
							{errorMessage}
						</div>
					)}
				</div>
			)}

			<Routes>
				<Route
					path='/'
					element={
						token ? (
							<Authors show={page === 'authors'} />
						) : (
							<Navigate to={'/login'} />
						)
					}
				/>
				{/* Protected Routes */}
				<Route
					path='/books'
					element={
						token ? (
							<Books show={page === 'books'} />
						) : (
							<Navigate to={'/login'} />
						)
					}
				/>
				<Route
					path='/add_book'
					element={
						token ? (
							<NewBook show={page === 'add'} setError={notify} />
						) : (
							<Navigate to={'/login'} />
						)
					}
				/>
				<Route
					path='/recommend'
					element={
						token ? (
							<Recommendation show={page === 'recommend'} />
						) : (
							<Navigate to={'/login'} />
						)
					}
				/>
				<Route
					path='/login'
					element={<LoginForm setError={notify} setToken={setToken} />}
				/>
			</Routes>
		</div>
	);
};

export default App;
