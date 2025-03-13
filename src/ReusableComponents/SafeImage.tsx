interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
  }
  
  const SafeImage = ({ src, fallbackSrc = "/userdefault.jpg", ...props }: SafeImageProps) => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null; // Prevent infinite loop
      target.src = fallbackSrc;
    };
  
    return (
      <img
        src={src || fallbackSrc}
        onError={handleError}
        {...props}
      />
    );
  };
  
  export default SafeImage;