import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useApolloClient, useSubscription } from '@apollo/client/react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendation from './components/Recommendation';
import { BOOK_ADDED } from './queries';

const App = () => {
	const [page, setPage] = useState('authors');
	const [errorMessage, setErrorMessage] = useState(null);
	const [token, setToken] = useState(
		localStorage.getItem('library-user-token'),
	);

	const client = useApolloClient();

	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			console.log('BOOK_ADDED data:', data);
			if (!data || !data.data || !data.data.bookAdded) {
				console.warn('Unexpected data shape');
				return;
			}
			const book = data.data?.bookAdded;
			window.alert(`New book "${book.title}" is added to the library`);
		},
	});

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
			<div>
				<Link to={'/'}>
					<button onClick={() => setPage('authors')}>authors</button>
				</Link>
				<Link to={'/books'}>
					<button onClick={() => setPage('books')}>books</button>
				</Link>
				{token && (
					<>
						<Link to={'/add_book'}>
							<button onClick={() => setPage('add')}>add book</button>
						</Link>
						<Link to={'/recommend'}>
							<button onClick={() => setPage('recommend')}>recommend</button>
						</Link>
						<button onClick={onLogout}>logout</button>
					</>
				)}
				{!token && (
					<Link to={'/login'}>
						<button>login</button>
					</Link>
				)}
				{errorMessage && (
					<div style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</div>
				)}
			</div>

			<Routes>
				<Route path='/' element={<Authors show={page === 'authors'} />} />
				<Route path='/books' element={<Books show={page === 'books'} />} />
				{/* Protected Routes */}
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
