import { useState, useEffect } from 'react';

interface parameter {
  value: number;
  delay: number;
}

const Debouncing = (param: parameter) => {
  const [debouncedValue, setDebouncedValue] = useState(param.value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(param.value);
      console.log(debouncedValue);
    }, param.delay);

    return () => {
      clearTimeout(timer);
      console.log('끝?');
    };
  }, [param.value, param.delay]);

  return debouncedValue;
};

export default Debouncing;
