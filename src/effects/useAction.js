import { useState, useCallback } from 'react'

const useAction = fn => {
    let [response, setResponse] = useState({ type: "idle" });
  
    let action = useCallback(
      (...args) => {
        setResponse({ type: "pending" });
        Promise.resolve(fn(...args))
          .then(result => setResponse({ type: 'success', result }))
          .catch(error => setResponse({ type: 'failure', error }));
      },
      [fn],
    );
  
    return [response, action];
}

export default useAction