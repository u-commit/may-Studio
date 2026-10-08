import { useEffect, useState } from 'react';

const MAX_TRANSLATE_X = 80;

const useTranslateXImage = (sectionRef) => {
  const [translateXPosition, setTranslateXPosition] =
    useState(MAX_TRANSLATE_X);

  useEffect(() => {
    const updateImagePosition = () => {
      const section = sectionRef.current;
      if (!section) return;

      const { top, height } = section.getBoundingClientRect();
      const travelDistance = window.innerHeight + height;
      const progress = Math.min(
        Math.max(
          (window.innerHeight - top) / travelDistance,
          0
        ),
        1
      );

      setTranslateXPosition(MAX_TRANSLATE_X * (1 - progress));
    };

    updateImagePosition();
    window.addEventListener('scroll', updateImagePosition, { passive: true });
    window.addEventListener('resize', updateImagePosition);
    return () => {
      window.removeEventListener('scroll', updateImagePosition);
      window.removeEventListener('resize', updateImagePosition);
    };
  }, [sectionRef]);

  return { translateXPosition };
};

export default useTranslateXImage;
