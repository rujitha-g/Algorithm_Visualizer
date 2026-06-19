import { useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export function useAnimationPlayer() {
  const { state, dispatch, totalFrames } = useApp();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isPlaying, speed, currentFrame } = state;

  const baseInterval = 800; // ms at speed 1×
  const intervalMs = baseInterval / speed;

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      stopInterval();
      return;
    }
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'NEXT_FRAME' });
    }, intervalMs);

    return stopInterval;
  }, [isPlaying, intervalMs, totalFrames, stopInterval]);

  const play = useCallback(() => {
    if (currentFrame >= totalFrames - 1) {
      dispatch({ type: 'SET_FRAME', payload: 0 });
    }
    dispatch({ type: 'SET_PLAYING', payload: true });
  }, [currentFrame, totalFrames, dispatch]);

  const pause = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
  }, [dispatch]);

  const stepForward = useCallback(() => {
    if (currentFrame < totalFrames - 1) {
      dispatch({ type: 'SET_FRAME', payload: currentFrame + 1 });
    }
  }, [currentFrame, totalFrames, dispatch]);

  const stepBack = useCallback(() => {
    if (currentFrame > 0) {
      dispatch({ type: 'SET_FRAME', payload: currentFrame - 1 });
    }
  }, [currentFrame, dispatch]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET_ANIMATION' });
  }, [dispatch]);

  const setSpeed = useCallback((s: number) => {
    dispatch({ type: 'SET_SPEED', payload: s });
  }, [dispatch]);

  const seekTo = useCallback((frame: number) => {
    dispatch({ type: 'SET_FRAME', payload: Math.max(0, Math.min(frame, totalFrames - 1)) });
  }, [totalFrames, dispatch]);

  return { play, pause, stepForward, stepBack, reset, setSpeed, seekTo };
}
