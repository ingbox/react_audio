import React, {useState , useRef, useEffect } from 'react'
import styles from '../styles/AudioPlayer.module.css'
import {BsArrowLeftShort} from "react-icons/bs"
import {BsArrowRightShort} from "react-icons/bs"
import {FaPlay} from "react-icons/fa"
import {FaPause} from "react-icons/fa"

const AudioPlayer = () => {
    // state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0); // 현재 시간을 보여주기위한 것 ref로 음악, 현재 재생 다 할 수 있지만 보여주기 위해
    
    //references
    const audioPlayer = useRef(); // reference our audio component
    const progressBar = useRef(); // reference our progressBar
    const animationRef = useRef(); //reference the animation
    

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);  // ... 써도 되는가 테스트 해봅시다
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        }
        else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current)
        }
        
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying)
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    
    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${ progressBar.current.value / duration * 100}%`) // 왼쪽의 색깔 다른 부분을 변경
        setCurrentTime(progressBar.current.value);
    }

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs/60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes} : ${returnedSeconds}`;
    }

    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value) - 30;
        changeRange();
    }

    
    const forThirty = () => {
        console.log(progressBar.current.value)
        progressBar.current.value = Number(progressBar.current.value) + 30;
        console.log(progressBar.current.value)
        changeRange();
    }

    useEffect( ()=> {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds)
        progressBar.current.max= seconds;


    },[audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);


    return(

        <div className={styles.audioPlayer}>
            <audio ref = { audioPlayer } src = "https://www.bensound.com/bensound-music/bensound-buddy.mp3" preload="metadata"/>
            <button className={ styles.fowardBackward } onClick = { backThirty }><BsArrowLeftShort />30</button>
            <button onClick={ togglePlayPause } className = {styles.playPause}>{ isPlaying ? <FaPause/> : <FaPlay/>}</button>
            <button className={ styles.fowardBackward } onClick = { forThirty }>30<BsArrowRightShort /></button>
            {/* current time */}
            <div className={ styles.currentTime }>{ calculateTime(currentTime) }</div>

            {/* progress bar */}
            <div><input type="range" ref = { progressBar } className={ styles.progressBar } onChange = { changeRange } defaultValue = "0" /></div>

            {/* duration */}
            <div className={ styles.duration }>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>

        </div>
    )
}

export { AudioPlayer }