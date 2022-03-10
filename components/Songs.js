import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom.js';
import Song from './Song.js';

const Songs = () => {
	
	const playlist = useRecoilValue(playlistState);
	
	return (
		<div className="text-white px-8 flex flex-col space-between space-y-1 pb-8">
			{playlist?.tracks.items.map((track, i) => (
				<Song key={track.track.id} track={track} order={i} />
			))}
		</div>
	);
};

export default Songs;