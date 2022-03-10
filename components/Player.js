import {
  HeartIcon,
  VolumeUpIcon as VolummeDownIcon,
} from '@heroicons/react/outline'
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom.js'
import useSongInfo from '../hooks/useSongInfo.js'
import useSpotify from '../hooks/useSpotify.js'

function Player(){
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('Now playing', data.body?.item)
        setCurrentTrackId(data.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume)
    }, 10),
    []
  )

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
          alt={songInfo?.name}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-xs text-gray-400">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out;" />
        <RewindIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out;" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}

        <FastForwardIcon
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out;"
          onClick={() => spotifyApi.skipToNext()}
        />
        <ReplyIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out;" />
      </div>

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolummeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out;"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out;"
        />
      </div>
    </div>
  )
}

export default Player
