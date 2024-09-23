"use client"
import { useEffect } from 'react';

const useScrollTrigger = (elementsSelector, className) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
          } else {
            entry.target.classList.remove(className);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const elements = document.querySelectorAll(elementsSelector);
    elements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [elementsSelector, className]);
};

export default useScrollTrigger;
