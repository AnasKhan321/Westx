import React from 'react';
import { Link } from 'react-router-dom';

interface DynamicTextProps {
  text: string;
  postedBy?: string;
}

export const DynamicText: React.FC<DynamicTextProps> = ({ text, postedBy }) => {
  const formatText = (text: string): React.ReactNode[] => {
    if (!text) return [];

    const mentionRegex = /@(\w+)/g; 
    const hashtagRegex = /#(\w+)/g; 

    
    const parts = text.split(/(@\w+|#\w+)/g);

    return parts.map((part, index) => {
      if (mentionRegex.test(part)) {
        const username = part.substring(1); 
        return (
          <Link
            key={`mention-${index}`}
            to={`https://westx.xyz/user/${username}`}
            
          >
            <a target='_blank' rel='noopener noreferrer' className='text-blue-500'>
              {part}
            </a>
          </Link>
        );
      }

      if (hashtagRegex.test(part)) {
        const hashtag = part.substring(1); 
        return (
          <Link
            key={`hashtag-${index}`}
            to ={`https://twitter.com/hashtag/${hashtag}`}
            
          >
            <a target='_blank' rel='noopener noreferrer' className='text-blue-500'>
              {part}
            </a>
          </Link>
        );
      }

      return <span key={`text-${index}`}>{part}</span>; 
    });
  };

  return (
    <div>
      {text && (
        <p className='whitespace-pre-line break-words'>
          {formatText(text)}
        </p>
      )}
      {postedBy === 'assistant' && (
        <span className='postedBy' title='AI Generated'>
    
        </span>
      )}
    </div>
  );
};



export const DynamicText2 = ({ text }  : {text : string}) => {
  const formatText = (text: string): React.ReactNode[] => {
    if (!text) return [];

    const mentionRegex = /@(\w+)/g; 
    const hashtagRegex = /#(\w+)/g; 

    
    const parts = text.split(/(@\w+|#\w+)/g);

    return parts.map((part, index) => {
      if (mentionRegex.test(part)) {
        const username = part.substring(1); 
        return (
          <Link
            key={`mention-${index}`}
            to={`https://westx.xyz/user/${username}`}
            
          >
            <a target='_blank' rel='noopener noreferrer' className='text-blue-500'>
              {part}
            </a>
          </Link>
        );
      }

      if (hashtagRegex.test(part)) {
        const hashtag = part.substring(1); 
        return (
          <Link
            key={`hashtag-${index}`}
            to ={`https://twitter.com/hashtag/${hashtag}`}
            
          >
            <a target='_blank' rel='noopener noreferrer' className='text-blue-500'>
              {part}
            </a>
          </Link>
        );
      }

      return <span key={`text-${index}`}>{part}</span>; 
    });
  };

  return (
    <div>
      {text && (
        <p className='whitespace-pre-line break-words'>
          {formatText(text)}
        </p>
      )}
    </div>
  );
};
