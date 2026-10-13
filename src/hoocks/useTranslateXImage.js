import { useEffect, useRef, useState } from 'react';
import useScrollHandling from '@/hoocks/useScrollHanding';

const useTranslateXImage = () => {
  const { scrollPosition, scrollDriction: scrollDirection } = useScrollHandling();
  const sectionRef = useRef(null);
  const [translateXPosition, setTranslateXPosition] = useState(80);

  useEffect(() => {
    if (scrollDirection === 'down' && scrollPosition >= 1500) {
      setTranslateXPosition((prev) => (prev <= 0 ? 0 : prev - 1));
    } else if (scrollDirection === 'up') {
      setTranslateXPosition((prev) => (prev >= 80 ? 80 : prev + 1));
    }
  }, [scrollPosition, scrollDirection]);

  return {
    sectionRef,
    translateXPosition,
  };
};

export default useTranslateXImage;
