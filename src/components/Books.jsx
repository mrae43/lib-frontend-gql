import { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';
import { ALL_BOOKS, BOOK_ADDED } from '../queries';
import { addBookToCache } from '../utils/apolloCache';

const Books = ({ client, notify }) => {
	const [genre, setGenre] = useState('all');
	const {
		data: filteredDataBooks,
		loading,
		error,
	} = useQuery(ALL_BOOKS, {
		variables: { genre: genre === 'all' ? null : genre },
	});

	const { data: fullDataBooks } = useQuery(ALL_BOOKS, {
		variables: { genre: null },
	});

	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			if (!data || !data.data || !data.data.bookAdded) {
				console.warn('Unexpected data shape');
				return;
			}
			const addedBook = data.data.bookAdded;
			notify(`New book "${addedBook.title}" is added to the library`);
			addBookToCache(client.cache, addedBook, genre);
		},
	});

	if (loading) return <div>loading...</div>;
	if (error) return <div>error: {error.message}</div>;

	const books = filteredDataBooks.allBooks;
	const allGenres = fullDataBooks
		? [...new Set(fullDataBooks.allBooks.flatMap((b) => b.genres))]
		: [];

	return (
		<div>
			<h2>books</h2>
			<div>
				{allGenres.map((g) => (
					<button key={g} onClick={() => setGenre(g)}>
						{g}
					</button>
				))}
				<button onClick={() => setGenre('all')}>all genre</button>
			</div>
			<table>
				<tbody>
					<tr>
						<th>title</th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.id}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Books;
