import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../queries';

const Books = () => {
	const [genre, setGenre] = useState('all');
	const { data, loading, error } = useQuery(ALL_BOOKS, {
		variables: { genre: genre === 'all' ? null : genre },
	});

	if (loading) return <div>loading...</div>;
	if (error) return <div>error: {error.message}</div>;

	const books = data.allBooks;

	const allGenres = [...new Set(books.flatMap((b) => b.genres))];

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
