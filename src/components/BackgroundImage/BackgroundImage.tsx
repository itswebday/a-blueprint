import Image from "next/image";
import { twMerge } from "tailwind-merge";

type BackgroundImageProps = {
  className?: string;
  src: string;
  alt: string;
};

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  className,
  src,
  alt,
}) => {
  return (
    <figure className={twMerge("absolute inset-0 z-0", className)}>
      <Image
        className="object-cover"
        src={src}
        alt={alt}
        fill={true}
        sizes="100vw"
        priority={true}
      />
    </figure>
  );
};

export default BackgroundImage;
