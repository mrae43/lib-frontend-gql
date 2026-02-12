import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ME } from '../queries';

const Recommendation = ({ show }) => {
	const user = useQuery(ME);
	const result = useQuery(ALL_BOOKS);

	if (!show) return null;
	if (user.loading || result.loading) return <div>loading...</div>;
	if (user.error || result.error) {
		return <div>error: {user.error?.message || result.error?.message}</div>;
	}

	const books = result.data.allBooks;
	const currentUser = user.data.me;

	if (!currentUser || !currentUser.favoriteGenre) {
		return null;
	}

	const favoriteGenre = currentUser.favoriteGenre;

	const filteredBooks = books.filter((b) => b.genres.includes(favoriteGenre));

	return (
		<div>
			<h2>Recommendations</h2>
			<p>
				books based on your favorite genre <strong>{favoriteGenre}</strong>
			</p>
			<table>
				<tbody>
					<tr>
						<th>book</th>
						<th>author</th>
						<th>published</th>
					</tr>
					{filteredBooks.map((b) => (
						<tr key={b.id}>
							<td>{b.title}</td>
							<td>{b.author.name}</td>
							<td>{b.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Recommendation;
